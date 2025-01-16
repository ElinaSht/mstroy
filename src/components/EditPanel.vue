<script setup lang="ts">
import MSButton from '@/components/MSButton.vue'

const editing = defineModel<boolean>('editing', { required: true })

const props = defineProps<{
  canUndo: boolean
  canRedo: boolean
}>()

const emits = defineEmits<{
  undo: []
  redo: []
}>()
</script>

<template>
  <div class="edit-panel">
    <h4 class="mode">
      <span class="name">Режим: </span>
      <span>{{ editing ? 'редактирование' : 'просмотр' }}</span>
    </h4>

    <div class="edit-buttons">
      <div v-if="editing" class="change">
        <MSButton
          icon="bi bi-arrow-counterclockwise"
          :disabled="props.canUndo"
          @click="emits('undo')"
        />

        <MSButton icon="bi bi-arrow-clockwise" :disabled="props.canRedo" @click="emits('redo')" />
      </div>

      <MSButton
        :icon="editing ? 'bi bi-floppy' : 'bi bi-pencil-square'"
        @click="editing = !editing"
      />
    </div>
  </div>
</template>

<style scoped>
.edit-panel {
  display: flex;
  align-items: center;
}

.edit-panel .mode {
  font-weight: normal;
  width: max-content;
}

.edit-panel .mode .name {
  font-weight: bold;
}

.edit-panel .edit-buttons {
  margin-left: auto;
  display: flex;
  gap: 40px;
}

.edit-panel .edit-buttons .change {
  display: flex;
  gap: 8px;
}
</style>
