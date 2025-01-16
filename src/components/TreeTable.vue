<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import { computed, ref } from 'vue'
import { type TreeItem, TreeStore } from '@/lib/tree-store.ts'
import type { ColDef, GetDataPath } from 'ag-grid-community'

const tree = ref(
  new TreeStore([
    { id: 1, parent: null, label: 'Айтем 1' },

    { id: '2', parent: 1, label: 'Айтем 2' },
    { id: 3, parent: 1, label: 'Айтем 3' },

    { id: 4, parent: '2', label: 'Айтем 4' },
    { id: 5, parent: '2', label: 'Айтем 5' },
    { id: 6, parent: '2', label: 'Айтем 6' },

    { id: 7, parent: 4, label: 'Айтем 7' },
    { id: 8, parent: 4, label: 'Айтем 8' },
  ]),
)

const rowData = computed<TreeItem[]>(() => tree.value.getAll())

const columnDefs = ref<ColDef<TreeItem>[]>([
  {
    headerName: '№ п\\п',
    width: 100,
    lockPosition: 'left',
    type: 'rowNumber',
    cellStyle: { fontWeight: 'bold' },
    valueGetter: ({ node }) => node!.rowIndex! + 1,
  },
  {
    headerName: 'Наименование',
    field: 'label',
    flex: 2,
    cellStyle: ({ node }) => (node!.allChildrenCount ? { fontWeight: 'bold' } : null),
  },
])

const autoGroupColumnDef: ColDef<TreeItem> = {
  headerName: 'Категория',
  flex: 1,
  cellRendererParams: {
    suppressCount: true,
  },
  cellStyle: ({ node }) => (node!.allChildrenCount ? { fontWeight: 'bold' } : null),
  valueGetter: ({ node }) => (node!.allChildrenCount ? 'Группа' : 'Элемент'),
}

const getDataPath = computed<GetDataPath<TreeItem>>(
  () => (data) =>
    tree.value
      .getAllParents(data.id)
      .map(({ id }) => String(id))
      .toReversed(),
)
</script>

<template>
  <AgGridVue
    :rowData
    :columnDefs
    :getDataPath
    :autoGroupColumnDef
    :groupDefaultExpanded="-1"
    treeData
  />
</template>

<style scoped></style>
