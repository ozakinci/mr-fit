<script setup lang="ts">
import MuscleDisplay from './components/MuscleDisplay.vue'
import MainRepButton from './components/MainRepButton.vue'
import ExercisesList from './components/ExercisesList.vue'
</script>

<template>
  <div id="app-root">
    <header class="app-header">
      <div class="container">
        <h1 class="app-title">Mr. Fit</h1>
        <MuscleDisplay />
      </div>
    </header>

    <main class="container app-main">
      <section class="clicker-section">
        <MainRepButton />
      </section>

      <section class="panels">
        <div class="panel">
          <ExercisesList />
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
  max-width: 480px;
  margin-inline: auto;
  width: 100%;
}

.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-md);
}
</style>
