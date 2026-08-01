// Pinia store holding all runtime game state for Mr. Fit's bodyweight
// home-workout loop. Composition-API (setup-function) style store, fully
// typed against the contracts in src/types/game.ts.

import { computed, onScopeDispose, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Exercise, ExerciseId, GameState } from '../types/game'

const STORAGE_KEY = 'mr-fit:game-save'
const AUTOSAVE_INTERVAL_MS = 10_000
const SAVE_DEBOUNCE_MS = 1_000
/** Muscle earned per rep before fatigue efficiency is applied. */
const BASE_MUSCLE_PER_REP = 1

/**
 * Seed data for a fresh game: the four launch bodyweight categories.
 * `repsPerSet` is the minimum reps a beginner can reasonably bang out in one
 * set of that movement — pull-ups are hard so it's low, core/legs are easier
 * so it's higher. Purely a balancing number, easy to retune later.
 */
function createInitialExercises(): Exercise[] {
  return [
    { id: 'push', name: 'Push', reps: 0, repsPerSet: 10 },
    { id: 'pull', name: 'Pull', reps: 0, repsPerSet: 5 },
    { id: 'legs', name: 'Legs', reps: 0, repsPerSet: 12 },
    { id: 'core', name: 'Core', reps: 0, repsPerSet: 15 },
  ]
}

/** Shape persisted to localStorage. Mirrors GameState exactly. */
type SavedGame = GameState

function isSavedGame(value: unknown): value is SavedGame {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.muscle === 'number' &&
    typeof v.totalClicks === 'number' &&
    Array.isArray(v.exercises) &&
    typeof v.lastSavedAt === 'number'
  )
}

export const useGameStore = defineStore('game', () => {
  // ---- State -------------------------------------------------------------
  /** Core resource built from completed reps. Replaces "currency" from v1. */
  const muscle = ref(0)
  const totalClicks = ref(0)
  const exercises = ref<Exercise[]>(createInitialExercises())
  const lastSavedAt = ref(Date.now())

  // ---- Computed ------------------------------------------------------------
  /** Lifetime reps across all exercise categories combined. */
  const totalReps = computed(() =>
    exercises.value.reduce((sum, exercise) => sum + exercise.reps, 0),
  )

  /**
   * Fraction of BASE_MUSCLE_PER_REP actually earned per rep. Hardcoded to 1
   * for now — MRFIT-6 will replace this with a non-linear function of
   * fatigue so grinding at high fatigue is clearly a bad trade. Reps/sets
   * already call through musclePerRep, so that ticket only needs to touch
   * this computed, not the action logic below.
   */
  const efficiency = computed(() => 1)

  /** Muscle earned per rep right now, after fatigue efficiency. */
  const musclePerRep = computed(() => BASE_MUSCLE_PER_REP * efficiency.value)

  // ---- Persistence -----------------------------------------------------
  function toSavedGame(): SavedGame {
    return {
      muscle: muscle.value,
      totalClicks: totalClicks.value,
      exercises: exercises.value,
      lastSavedAt: lastSavedAt.value,
    }
  }

  function saveNow(): void {
    if (typeof localStorage === 'undefined') return
    lastSavedAt.value = Date.now()
    const snapshot: SavedGame = toSavedGame()
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

  function loadFromStorage(): void {
    const saved = loadSavedGame()
    if (!saved) {
      lastSavedAt.value = Date.now()
      return
    }
    muscle.value = saved.muscle
    totalClicks.value = saved.totalClicks
    exercises.value = saved.exercises
    lastSavedAt.value = Date.now()
  }

  // ---- Actions -------------------------------------------------------------
  /**
   * The main click button: logs 1 rep for every exercise category at once
   * and banks the muscle earned for those reps. There is no "selected"
   * exercise — the button is universal.
   */
  function clickMain(): void {
    for (const exercise of exercises.value) {
      exercise.reps += 1
      muscle.value += musclePerRep.value
    }
    totalClicks.value += 1
    scheduleSave()
  }

  /**
   * An exercise category's own button: performs a full "set" in one click,
   * applying that exercise's minimum rep count (and its muscle) instead of
   * requiring that many individual clicks.
   */
  function performSet(id: ExerciseId): boolean {
    const exercise = exercises.value.find((e) => e.id === id)
    if (!exercise) return false
    exercise.reps += exercise.repsPerSet
    muscle.value += musclePerRep.value * exercise.repsPerSet
    scheduleSave()
    return true
  }

  // ---- Init / autosave lifecycle ------------------------------------------
  loadFromStorage()

  let autosaveInterval: ReturnType<typeof setInterval> | null = null
  if (typeof window !== 'undefined') {
    autosaveInterval = setInterval(saveNow, AUTOSAVE_INTERVAL_MS)
    window.addEventListener('beforeunload', saveNow)
  }

  // Pinia setup-stores run inside their own effectScope, not a component's
  // setup(), so onUnmounted would attach to whatever component happens to
  // call useGameStore() first rather than the store's own lifetime. Use
  // onScopeDispose, which ties correctly to the store's effectScope.
  onScopeDispose(() => {
    if (autosaveInterval) clearInterval(autosaveInterval)
    if (typeof window !== 'undefined') window.removeEventListener('beforeunload', saveNow)
  })

  return {
    // state
    muscle,
    totalClicks,
    exercises,
    lastSavedAt,
    // computed
    totalReps,
    efficiency,
    musclePerRep,
    // actions
    clickMain,
    performSet,
    // persistence
    saveNow,
  }
})
