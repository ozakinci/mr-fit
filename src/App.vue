<script setup lang="ts">
import { useGameStore } from './stores/game'
import { useGameLoop } from './composables/useGameLoop'
import CurrencyDisplay from './components/CurrencyDisplay.vue'
import ClickerButton from './components/ClickerButton.vue'
import GeneratorsList from './components/GeneratorsList.vue'
import UpgradesList from './components/UpgradesList.vue'

const store = useGameStore()

useGameLoop((deltaSeconds) => {
  store.tick(deltaSeconds)
})
</script>

<template>
  <div id="app-root">
    <header class="app-header">
      <div class="container">
        <h1 class="app-title">Mr. Fit</h1>
        <CurrencyDisplay />
      </div>
    </header>

    <main class="container app-main">
      <section class="clicker-section">
        <ClickerButton />
      </section>

      <section class="panels">
        <div class="panel">
          <GeneratorsList />
        </div>
        <div class="panel">
          <UpgradesList />
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-header {
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.app-header .container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-block: var(--space-sm);
}

.app-title {
  text-align: center;
}

.app-main {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  padding-block: var(--space-xl);
}

.clicker-section {
  display: flex;
  justify-content: center;
}

.panels {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}

@media (min-width: 720px) {
  .panels {
    grid-template-columns: 1fr 1fr;
  }
}

.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-md);
}
</style>
