<script setup lang="ts">
import { useGameStore } from '../stores/game'
import GeneratorItem from './GeneratorItem.vue'

const store = useGameStore()
</script>

<template>
  <div class="generators-list">
    <h2 class="section-title">Generators</h2>
    <div class="generators-items">
      <GeneratorItem
        v-for="generator in store.generators"
        :key="generator.id"
        :generator="generator"
      />
    </div>
  </div>
</template>

<style scoped>
.generators-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  font-size: 1.1rem;
  margin: 0 0 0.25rem;
}

.generators-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
