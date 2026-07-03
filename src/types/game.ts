// Core TypeScript contracts for Mr. Fit's bodyweight home-workout loop.
// This file defines shape only — actual balancing numbers live in
// src/stores/game.ts.

/** Stable identifiers for the four launch exercise categories. */
export type ExerciseId = 'push' | 'pull' | 'legs' | 'core'

/**
 * One bodyweight exercise category (Push, Pull, Legs, or Core). Tracks its
 * own lifetime rep count. The reps applied per "set" click are a fixed
 * minimum per category (repsPerSet), not something the player buys more of.
 */
export interface Exercise {
  /** Stable unique identifier, e.g. "push". */
  id: ExerciseId
  /** Display name shown in the UI, e.g. "Push". */
  name: string
  /** Lifetime reps completed for this exercise. */
  reps: number
  /** Reps applied in one action when this exercise's own button is clicked (a "set"). */
  repsPerSet: number
}

/**
 * The full serializable state of a game session. This is what gets
 * persisted to (and restored from) save storage.
 */
export interface GameState {
  /** Lifetime count of manual main-button clicks performed by the player. */
  totalClicks: number
  /** All four exercise categories, including their lifetime rep counts. */
  exercises: Exercise[]
  /** Unix timestamp (ms) of the last time this state was saved. */
  lastSavedAt: number
}
