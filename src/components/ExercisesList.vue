<script setup lang="ts">
import { useGameStore } from '../stores/game'
import ExerciseButton from './ExerciseButton.vue'

const store = useGameStore()
</script>

<template>
  <div class="exercises-list">
    <h2 class="section-title">Exercises</h2>
    <div class="exercises-items">
      <ExerciseButton
        v-for="exercise in store.exercises"
        :key="exercise.id"
        :exercise="exercise"
      />
    </div>
  </div>
</template>

<style scoped>
.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  font-size: 1.1rem;
  margin: 0 0 0.25rem;
}

.exercises-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
