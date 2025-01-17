<script setup lang="ts">
import MSButton from '@/components/MSButton.vue'
import { computed } from 'vue'

const expanded = defineModel('expanded', { required: true })

const props = defineProps<{
  level: number
  group: boolean
  editing: boolean
}>()

const emits = defineEmits<{
  create: []
  remove: []
}>()

const offset = computed(() => (props.group ? props.level * 20 : props.level * 20 + 23))
</script>

<template>
  <div class="category-cell">
    <MSButton
      v-if="props.group"
      mini
      :icon="expanded ? 'bi-chevron-up' : 'bi-chevron-down'"
      @click="expanded = !expanded"
    />

    <span class="label" :class="{ group: props.group }" :style="{ marginLeft: `${offset}px` }">
      {{ props.group ? 'Группа' : 'Элемент' }}
    </span>

    <div class="buttons" v-if="props.editing">
      <MSButton mini icon="bi-plus" @click="emits('create')" type="primary" />
      <MSButton mini icon="bi-x" @click="emits('remove')" type="danger" />
    </div>
  </div>
</template>

<style scoped>
.category-cell {
  display: flex;
  align-items: center;
}

.category-cell .label {
  padding-left: 10px;
}

.category-cell .label.group {
  font-weight: bold;
}

.category-cell .buttons {
  margin-left: auto;
  display: flex;
  gap: 6px;
}
</style>
