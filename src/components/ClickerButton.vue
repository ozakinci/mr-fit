<script setup lang="ts">
import { useGameStore } from '../stores/game'

const store = useGameStore()

function handleClick(): void {
  store.click()
}
</script>

<template>
  <button class="clicker-button" type="button" @click="handleClick">
    Click me!
  </button>
</template>

<style scoped>
.clicker-button {
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

.clicker-button:hover {
  background: #4338ca;
}

.clicker-button:active {
  transform: scale(0.92);
  box-shadow: 0 2px 6px rgba(79, 70, 229, 0.4);
}
</style>
