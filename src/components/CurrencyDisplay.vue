<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/game'
import { formatNumber } from '../utils/numberFormat'

const store = useGameStore()

const currency = computed(() => store.currency)
const currencyPerSecond = computed(() => store.currencyPerSecond)
</script>

<template>
  <div class="currency-display">
    <div class="currency-amount">{{ formatNumber(currency) }}</div>
    <div class="currency-rate">{{ formatNumber(currencyPerSecond) }}/sec</div>
  </div>
</template>

<style scoped>
.currency-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem;
}

.currency-amount {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.1;
}

.currency-rate {
  font-size: 1rem;
  opacity: 0.7;
}
</style>
