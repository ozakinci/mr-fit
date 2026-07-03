// Core TypeScript contracts for the incremental/idle clicker game.
// This file defines shape only — actual game content (generator/upgrade
// definitions, balancing numbers, etc.) is filled in during a later phase.

/**
 * A passive-income producer that the player can buy multiple copies of.
 * Each additional copy costs more than the last, growing by `costGrowth`.
 */
export interface Generator {
  /** Stable unique identifier, e.g. "cursor" or "gym". */
  id: string
  /** Display name shown in the UI. */
  name: string
  /** Cost to purchase the 1st copy (owned === 0 -> next cost is baseCost). */
  baseCost: number
  /** Multiplicative growth applied to cost per copy already owned, e.g. 1.15 = +15% per copy. */
  costGrowth: number
  /** Currency produced per second by a single copy of this generator (before multipliers). */
  baseProduction: number
  /** Number of copies of this generator the player currently owns. */
  owned: number
}

/**
 * Describes what an upgrade does when purchased. A discriminated union so
 * downstream code can exhaustively switch on `type` when applying effects.
 */
export type UpgradeEffect =
  | {
      /** Multiplies the player's manual click power. */
      type: 'clickPowerMultiplier'
      multiplier: number
    }
  | {
      /** Multiplies the production of a single generator (by id). */
      type: 'generatorMultiplier'
      generatorId: string
      multiplier: number
    }
  | {
      /** Multiplies production of every generator. */
      type: 'globalProductionMultiplier'
      multiplier: number
    }
  | {
      /** Flat addition to manual click power. */
      type: 'clickPowerFlat'
      amount: number
    }

/**
 * A one-time purchasable upgrade that applies a permanent effect once bought.
 */
export interface Upgrade {
  /** Stable unique identifier, e.g. "double-click" or "gym-boost-1". */
  id: string
  /** Display name shown in the UI. */
  name: string
  /** Flavor/explanatory text shown in the UI. */
  description: string
  /** Currency cost to purchase this upgrade. */
  cost: number
  /** What happens to game state when this upgrade is purchased. */
  effect: UpgradeEffect
  /** Whether the player has already bought this upgrade. */
  purchased: boolean
}

/**
 * The full serializable state of a game session. This is what gets
 * persisted to (and restored from) save storage.
 */
export interface GameState {
  /** Current currency balance. */
  currency: number
  /** Lifetime count of manual clicks performed by the player. */
  totalClicks: number
  /** Currency earned per manual click (before any per-click bonuses). */
  clickPower: number
  /** All generators available in this game, including unowned ones. */
  generators: Generator[]
  /** All upgrades available in this game, including unpurchased ones. */
  upgrades: Upgrade[]
  /** Unix timestamp (ms) of the last time this state was saved. */
  lastSavedAt: number
}
