<script setup lang="ts">
import { useGameStore } from '../stores/game'
import UpgradeItem from './UpgradeItem.vue'

const store = useGameStore()
</script>

<template>
  <div class="upgrades-list">
    <h2 class="section-title">Upgrades</h2>
    <div class="upgrades-items">
      <UpgradeItem
        v-for="upgrade in store.upgrades"
        :key="upgrade.id"
        :upgrade="upgrade"
      />
    </div>
  </div>
</template>

<style scoped>
.upgrades-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  font-size: 1.1rem;
  margin: 0 0 0.25rem;
}

.upgrades-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
