<script setup lang="ts">
import { useGameStore } from '../stores/game'

const store = useGameStore()

function handleClick(): void {
  store.clickMain()
}
</script>

<template>
  <button class="main-rep-button" type="button" @click="handleClick">
    Work Out!
  </button>
</template>

<style scoped>
.main-rep-button {
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  border: none;
  background: #4f46e5;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  transition: transform 0.08s ease, box-shadow 0.08s ease, background-color 0.15s ease;
}

.main-rep-button:hover {
  background: #4338ca;
}

.main-rep-button:active {
  transform: scale(0.92);
  box-shadow: 0 2px 6px rgba(79, 70, 229, 0.4);
}
</style>
