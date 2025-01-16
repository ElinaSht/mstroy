<script setup lang="ts">
const props = defineProps<{
  label?: string
  icon: string
  disabled?: boolean
}>()
</script>

<template>
  <button class="button" :disabled>
    <i :class="props.icon" class="icon"></i>
    <span v-if="props.label">{{ props.label }}</span>
  </button>
</template>

<style scoped>
.button {
  display: flex;
  justify-content: center;
  gap: 10px;
  outline: none;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid#d9d9db;
  cursor: pointer;
  background: #fafafb;
  transition: 0.2s ease-out;
  transition-property: background-color, transform;
  will-change: background-color, transform;
}

.button .icon {
  font-size: 20px;
}

.button:not(:disabled):hover {
  background: #fff;
}

.button:active {
  transition: 0.1s ease-out;
  transform: scale(0.9);
}

.button:disabled {
  cursor: not-allowed;
}
</style>
