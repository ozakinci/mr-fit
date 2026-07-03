<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/game'
import { formatNumber } from '../utils/numberFormat'

const store = useGameStore()

const muscle = computed(() => store.muscle)
const totalReps = computed(() => store.totalReps)
</script>

<template>
  <div class="muscle-display">
    <div class="muscle-amount">{{ formatNumber(muscle) }}</div>
    <div class="muscle-label">muscle</div>
    <div class="muscle-reps">{{ formatNumber(totalReps) }} reps total</div>
  </div>
</template>

<style scoped>
.muscle-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem;
}

.muscle-amount {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.1;
}

.muscle-label {
  font-size: 0.9rem;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.muscle-reps {
  font-size: 1rem;
  opacity: 0.7;
}
</style>
