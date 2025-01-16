<script setup lang="ts">
import TreeTable from '@/components/TreeTable.vue'
import EditPanel from '@/components/EditPanel.vue'
</script>

<template>
  <div class="app">
    <EditPanel class="edit-panel" />
    <TreeTable class="table" />
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
