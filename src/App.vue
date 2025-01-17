<script setup lang="ts">
import TreeTable from '@/components/TreeTable.vue'
import EditPanel from '@/components/EditPanel.vue'
import { ref, shallowRef } from 'vue'

const editing = ref<boolean>(false)
const canUndo = ref<boolean>(false)
const canRedo = ref<boolean>(false)

const tableRef = shallowRef<InstanceType<typeof TreeTable>>()

const items = [
  { id: 1, parent: null, label: 'Айтем 1' },

  { id: '2', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },

  { id: 4, parent: '2', label: 'Айтем 4' },
  { id: 5, parent: '2', label: 'Айтем 5' },
  { id: 6, parent: '2', label: 'Айтем 6' },

  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
]
</script>

<template>
  <div class="app">
    <EditPanel
      v-model:editing="editing"
      class="edit-panel"
      :canUndo
      :canRedo
      @undo="tableRef?.undo()"
      @redo="tableRef?.redo()"
    />

    <TreeTable
      ref="tableRef"
      class="table"
      :editing
      :items
      @update:canUndo="canUndo = $event"
      @update:canRedo="canRedo = $event"
    />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.app .table {
  flex: 1;
}

.app .edit-panel {
}
</style>
