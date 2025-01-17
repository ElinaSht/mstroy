<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import { computed, defineComponent, h, ref, shallowRef, watch } from 'vue'
import { type TreeItem, TreeStore } from '@/lib/tree-store.ts'
import type {
  ColDef,
  GetDataPath,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-community'
import CategoryCell from '@/components/CategoryCell.vue'

const props = defineProps<{
  items: TreeItem[]
  editing: boolean
}>()

const emits = defineEmits<{
  'update:canUndo': [boolean]
  'update:canRedo': [boolean]
}>()

const tree = ref(new TreeStore(props.items))
watch(
  () => props.items,
  (v) => (tree.value = new TreeStore(v)),
)

const rowData = computed<TreeItem[]>(() => tree.value.getAll())

const columnDefs = computed<ColDef<TreeItem>[]>(() => [
  {
    headerName: '№ п\\п',
    width: 100,
    lockPosition: 'left',
    cellStyle: { fontWeight: 'bold' },
    valueGetter: ({ node }) => node!.rowIndex! + 1,
  },
  {
    headerName: 'Наименование',
    field: 'label',
    flex: 2,
    editable: props.editing,
    cellStyle: ({ node }) => (node!.allChildrenCount ? { fontWeight: 'bold' } : null),
  },
])

const autoGroupColumnDef: ColDef<TreeItem> = {
  headerName: 'Категория',
  flex: 1,
  cellRenderer: defineComponent({
    props: ['params'],
    setup: (cellProps: { params: ICellRendererParams<TreeItem> }) => {
      const expanded = ref<boolean>(cellProps.params.node.expanded)
      watch(expanded, (v) => gridApi.value!.setRowNodeExpanded(cellProps.params.node, v))

      return () =>
        h(CategoryCell, {
          group: !!cellProps.params.node.allChildrenCount,
          level: cellProps.params.node.level,
          expanded: expanded.value,
          editing: props.editing,
          onCreate: () => {
            const newId = Date.now()

            return tree.value.addItem({
              id: newId,
              parent: cellProps.params.data!.id,
              label: `Айтем ${newId}`,
            })
          },
          onRemove: () => tree.value.removeItem(cellProps.params.data!.id),
          'onUpdate:expanded': (v) => (expanded.value = v),
        })
    },
  }),
}

const getDataPath = computed<GetDataPath<TreeItem>>(
  () => (data) =>
    tree.value
      .getAllParents(data.id)
      .map(({ id }) => String(id))
      .toReversed(),
)

const gridApi = shallowRef<GridApi>()
function onGridReady(params: GridReadyEvent) {
  gridApi.value = params.api
}

function undo() {
  gridApi.value!.undoCellEditing()
}
function onUndoEnded() {
  const count = gridApi.value!.getCurrentUndoSize()
  emits('update:canUndo', count > 0)
}

function redo() {
  gridApi.value!.redoCellEditing()
}
function onRedoEnded() {
  const count = gridApi.value!.getCurrentRedoSize()
  emits('update:canRedo', count > 0)
}

function onCellValueChanged() {
  onUndoEnded()
  onRedoEnded()
}

defineExpose({
  undo,
  redo,
})
</script>

<template>
  <AgGridVue
    :rowData
    :columnDefs
    :getDataPath
    :autoGroupColumnDef
    :groupDefaultExpanded="-1"
    treeData
    undoRedoCellEditing
    :undoRedoCellEditingLimit="100"
    @gridReady="onGridReady"
    @undoEnded="onUndoEnded"
    @redoEnded="onRedoEnded"
    @cellValueChanged="onCellValueChanged"
  />
</template>

<style scoped></style>
