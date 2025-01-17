<script setup lang="ts">
const props = defineProps<{
  icon: string
  label?: string
  disabled?: boolean
  mini?: boolean
  type?: 'primary' | 'danger'
}>()
</script>

<template>
  <button class="button" :class="[props.type, { mini: props.mini }]" :disabled>
    <i :class="props.icon" class="icon"></i>
    <label v-if="props.label">{{ props.label }}</label>
  </button>
</template>

<style scoped>
.button {
  display: flex;
  justify-content: center;
  align-items: center;
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
  line-height: 1;
}

.button:not(:disabled):hover {
  background-color: #fff;
}

.button:active {
  transition: 0.1s ease-out;
  transform: scale(0.9);
}

.button:disabled {
  cursor: not-allowed;
}

.button.mini {
  border-radius: 100px;
  padding: 0;
  width: 24px;
  height: 24px;
}

.button.mini .icon {
  font-size: 16px;
}

.button.primary {
  background-color: darkblue;
  border-color: transparent;
}

.button.danger {
  background-color: darkred;
  border-color: transparent;
}

.button.primary .icon,
.button.danger .icon {
  color: white;
}

.button.primary:not(:disabled):hover {
  background-color: #0101d3;
}

.button.danger:not(:disabled):hover {
  background-color: #d00101;
}
</style>
