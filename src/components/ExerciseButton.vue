<script setup lang="ts">
import { useGameStore } from '../stores/game'
import { formatNumber } from '../utils/numberFormat'
import type { Exercise } from '../types/game'

const props = defineProps<{
  exercise: Exercise
}>()

const store = useGameStore()

function handleSet(): void {
  store.performSet(props.exercise.id)
}
</script>

<template>
  <div class="exercise-item">
    <div class="exercise-info">
      <div class="exercise-name">{{ exercise.name }}</div>
      <div class="exercise-meta">{{ formatNumber(exercise.reps) }} reps total</div>
    </div>
    <button class="set-button" type="button" @click="handleSet">
      Do a set (+{{ exercise.repsPerSet }})
    </button>
  </div>
</template>

<style scoped>
.exercise-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 0.5rem;
}

.exercise-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.exercise-name {
  font-weight: 600;
}

.exercise-meta {
  font-size: 0.85rem;
  opacity: 0.7;
}

.set-button {
  padding: 0.5rem 0.9rem;
  border: none;
  border-radius: 0.375rem;
  background: #16a34a;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.set-button:hover {
  background: #15803d;
}
</style>
