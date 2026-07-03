<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/game'
import { formatNumber } from '../utils/numberFormat'
import type { Generator } from '../types/game'

const props = defineProps<{
  generator: Generator
}>()

const store = useGameStore()

const nextCost = computed(
  () => props.generator.baseCost * props.generator.costGrowth ** props.generator.owned,
)

const canAfford = computed(() => store.currency >= nextCost.value)

function handleBuy(): void {
  store.buyGenerator(props.generator.id)
}
</script>

<template>
  <div class="generator-item">
    <div class="generator-info">
      <div class="generator-name">{{ generator.name }}</div>
      <div class="generator-meta">
        Owned: {{ generator.owned }} &middot;
        {{ formatNumber(generator.baseProduction) }}/sec each
      </div>
    </div>
    <button
      class="buy-button"
      type="button"
      :disabled="!canAfford"
      @click="handleBuy"
    >
      Buy — {{ formatNumber(nextCost) }}
    </button>
  </div>
</template>

<style scoped>
.generator-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 0.5rem;
}

.generator-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.generator-name {
  font-weight: 600;
}

.generator-meta {
  font-size: 0.85rem;
  opacity: 0.7;
}

.buy-button {
  padding: 0.5rem 0.9rem;
  border: none;
  border-radius: 0.375rem;
  background: #16a34a;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.buy-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
