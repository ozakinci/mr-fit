// Pinia store holding all runtime game state for the incremental clicker.
// Composition-API (setup-function) style store, fully typed against the
// contracts in src/types/game.ts.

import { computed, onUnmounted, ref } from 'vue'
import { defineStore } from 'pinia'
import type { GameState, Generator, Upgrade, UpgradeEffect } from '../types/game'

const STORAGE_KEY = 'mr-fit:game-save'
const AUTOSAVE_INTERVAL_MS = 10_000
const SAVE_DEBOUNCE_MS = 1_000
/** Cap offline-progress catch-up so a stale save can't grant an absurd windfall. */
const MAX_OFFLINE_MS = 8 * 60 * 60 * 1000 // 8 hours

/** Seed data for a fresh game. Mutated in place by upgrade effects (e.g.
 * generatorMultiplier / globalProductionMultiplier permanently scale
 * baseProduction), so no separate "multiplier" state is needed. */
function createInitialGenerators(): Generator[] {
  return [
    { id: 'cursor', name: 'Cursor', baseCost: 15, costGrowth: 1.15, baseProduction: 0.1, owned: 0 },
    { id: 'factory', name: 'Factory', baseCost: 100, costGrowth: 1.15, baseProduction: 1, owned: 0 },
    { id: 'mine', name: 'Mine', baseCost: 1_100, costGrowth: 1.15, baseProduction: 8, owned: 0 },
    { id: 'bank', name: 'Bank', baseCost: 12_000, costGrowth: 1.15, baseProduction: 47, owned: 0 },
  ]
}

function createInitialUpgrades(): Upgrade[] {
  return [
    {
      id: 'sturdy-grip',
      name: 'Sturdy Grip',
      description: '+1 flat currency per click.',
      cost: 20,
      effect: { type: 'clickPowerFlat', amount: 1 },
      purchased: false,
    },
    {
      id: 'double-click',
      name: 'Double Click',
      description: 'Doubles your click power.',
      cost: 100,
      effect: { type: 'clickPowerMultiplier', multiplier: 2 },
      purchased: false,
    },
    {
      id: 'cursor-boost',
      name: 'Ergonomic Cursors',
      description: 'Doubles the production of every Cursor.',
      cost: 250,
      effect: { type: 'generatorMultiplier', generatorId: 'cursor', multiplier: 2 },
      purchased: false,
    },
    {
      id: 'global-efficiency',
      name: 'Global Efficiency',
      description: 'Boosts all generator production by 50%.',
      cost: 5_000,
      effect: { type: 'globalProductionMultiplier', multiplier: 1.5 },
      purchased: false,
    },
  ]
}

/** Shape persisted to localStorage. Mirrors GameState exactly. */
type SavedGame = GameState

function isSavedGame(value: unknown): value is SavedGame {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.currency === 'number' &&
    typeof v.totalClicks === 'number' &&
    typeof v.clickPower === 'number' &&
    Array.isArray(v.generators) &&
    Array.isArray(v.upgrades) &&
    typeof v.lastSavedAt === 'number'
  )
}

export const useGameStore = defineStore('game', () => {
  // ---- State ---------------------------------------------------------
  const currency = ref(0)
  const totalClicks = ref(0)
  const clickPower = ref(1)
  const generators = ref<Generator[]>(createInitialGenerators())
  const upgrades = ref<Upgrade[]>(createInitialUpgrades())
  const lastSavedAt = ref(Date.now())

  // ---- Computed --------------------------------------------------------
  /** Total currency produced per second across all owned generators. */
  const totalProduction = computed(() =>
    generators.value.reduce((sum, gen) => sum + gen.baseProduction * gen.owned, 0),
  )
  /** Alias of totalProduction — matches the name UI components bind to. */
  const currencyPerSecond = totalProduction

  function costFor(generator: Generator): number {
    return generator.baseCost * Math.pow(generator.costGrowth, generator.owned)
  }

  // ---- Persistence -----------------------------------------------------
  function toSavedGame(): SavedGame {
    return {
      currency: currency.value,
      totalClicks: totalClicks.value,
      clickPower: clickPower.value,
      generators: generators.value,
      upgrades: upgrades.value,
      lastSavedAt: Date.now(),
    }
  }

  function saveNow(): void {
    if (typeof localStorage === 'undefined') return
    lastSavedAt.value = Date.now()
    const snapshot: SavedGame = { ...toSavedGame(), lastSavedAt: lastSavedAt.value }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    } catch {
      // Storage full/unavailable — silently skip, not fatal to gameplay.
    }
  }

  let saveTimeout: ReturnType<typeof setTimeout> | null = null
  function scheduleSave(): void {
    if (saveTimeout) clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => {
      saveTimeout = null
      saveNow()
    }, SAVE_DEBOUNCE_MS)
  }

  function loadSavedGame(): SavedGame | null {
    if (typeof localStorage === 'undefined') return null
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    try {
      const parsed: unknown = JSON.parse(raw)
      return isSavedGame(parsed) ? parsed : null
    } catch {
      return null
    }
  }

  function applyOfflineProgress(saved: SavedGame): void {
    const elapsedMs = Math.max(0, Date.now() - saved.lastSavedAt)
    const cappedMs = Math.min(elapsedMs, MAX_OFFLINE_MS)
    const cappedSeconds = cappedMs / 1000
    const offlineProduction = saved.generators.reduce(
      (sum, gen) => sum + gen.baseProduction * gen.owned,
      0,
    )
    saved.currency += offlineProduction * cappedSeconds
  }

  function loadFromStorage(): void {
    const saved = loadSavedGame()
    if (!saved) {
      lastSavedAt.value = Date.now()
      return
    }
    applyOfflineProgress(saved)
    currency.value = saved.currency
    totalClicks.value = saved.totalClicks
    clickPower.value = saved.clickPower
    generators.value = saved.generators
    upgrades.value = saved.upgrades
    lastSavedAt.value = Date.now()
  }

  // ---- Actions -----------------------------------------------------------
  function click(): void {
    currency.value += clickPower.value
    totalClicks.value += 1
    scheduleSave()
  }

  function buyGenerator(id: string): boolean {
    const generator = generators.value.find((g) => g.id === id)
    if (!generator) return false
    const cost = costFor(generator)
    if (currency.value < cost) return false
    currency.value -= cost
    generator.owned += 1
    scheduleSave()
    return true
  }

  function applyUpgradeEffect(effect: UpgradeEffect): void {
    switch (effect.type) {
      case 'clickPowerMultiplier':
        clickPower.value *= effect.multiplier
        break
      case 'clickPowerFlat':
        clickPower.value += effect.amount
        break
      case 'generatorMultiplier': {
        const generator = generators.value.find((g) => g.id === effect.generatorId)
        if (generator) generator.baseProduction *= effect.multiplier
        break
      }
      case 'globalProductionMultiplier':
        for (const generator of generators.value) {
          generator.baseProduction *= effect.multiplier
        }
        break
      default: {
        // Exhaustiveness check: fails to compile if UpgradeEffect grows a new variant.
        const _exhaustive: never = effect
        void _exhaustive
      }
    }
  }

  function buyUpgrade(id: string): boolean {
    const upgrade = upgrades.value.find((u) => u.id === id)
    if (!upgrade || upgrade.purchased) return false
    if (currency.value < upgrade.cost) return false
    currency.value -= upgrade.cost
    upgrade.purchased = true
    applyUpgradeEffect(upgrade.effect)
    scheduleSave()
    return true
  }

  function tick(deltaSeconds: number): void {
    if (deltaSeconds <= 0) return
    currency.value += totalProduction.value * deltaSeconds
  }

  // ---- Init / autosave lifecycle ------------------------------------------
  loadFromStorage()

  let autosaveInterval: ReturnType<typeof setInterval> | null = null
  if (typeof window !== 'undefined') {
    autosaveInterval = setInterval(saveNow, AUTOSAVE_INTERVAL_MS)
    window.addEventListener('beforeunload', saveNow)
  }

  onUnmounted(() => {
    if (autosaveInterval) clearInterval(autosaveInterval)
    if (typeof window !== 'undefined') window.removeEventListener('beforeunload', saveNow)
  })

  return {
    // state
    currency,
    totalClicks,
    clickPower,
    generators,
    upgrades,
    lastSavedAt,
    // computed
    totalProduction,
    currencyPerSecond,
    // helpers
    costFor,
    // actions
    click,
    buyGenerator,
    buyUpgrade,
    tick,
    saveNow,
  }
})
