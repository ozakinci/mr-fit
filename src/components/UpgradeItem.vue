<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/game'
import { formatNumber } from '../utils/numberFormat'
import type { Upgrade } from '../types/game'

const props = defineProps<{
  upgrade: Upgrade
}>()

const store = useGameStore()

const canAfford = computed(() => store.currency >= props.upgrade.cost)

function handleBuy(): void {
  store.buyUpgrade(props.upgrade.id)
}
</script>

<template>
  <div class="upgrade-item" :class="{ purchased: upgrade.purchased }">
    <div class="upgrade-info">
      <div class="upgrade-name">{{ upgrade.name }}</div>
      <div class="upgrade-description">{{ upgrade.description }}</div>
    </div>
    <button
      v-if="!upgrade.purchased"
      class="buy-button"
      type="button"
      :disabled="!canAfford"
      @click="handleBuy"
    >
      Buy — {{ formatNumber(upgrade.cost) }}
    </button>
    <span v-else class="purchased-label">Purchased</span>
  </div>
</template>

<style scoped>
.upgrade-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 0.5rem;
}

.upgrade-item.purchased {
  opacity: 0.5;
}

.upgrade-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.upgrade-name {
  font-weight: 600;
}

.upgrade-description {
  font-size: 0.85rem;
  opacity: 0.7;
}

.buy-button {
  padding: 0.5rem 0.9rem;
  border: none;
  border-radius: 0.375rem;
  background: #2563eb;
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

.purchased-label {
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}
</style>
