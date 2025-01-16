import { describe, it, expect, beforeEach } from 'vitest'
import { TreeStore } from "@/lib/tree-store.ts";

describe('TreeStore', () => {
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

  let tree: TreeStore

  beforeEach(() => {
    tree = new TreeStore(items)
  })

  describe('getAll', () => {
    it('should return the original array of elements', () => {
      expect(tree.getAll()).toStrictEqual(items)
    })
  })

  describe('getItem', () => {
    it('should return item by item id', () => {
      expect(tree.getItem(1)).toStrictEqual({ id: 1, parent: null, label: 'Айтем 1' })
    })

    it('should return undefined if item id not exist', () => {
      expect(tree.getItem(100)).toBeUndefined()
    })
  })

  describe('getChildren', () => {
    it('should return array of child elements by parent id', () => {
      expect(tree.getChildren(1)).toStrictEqual([
        { id: '2', parent: 1, label: 'Айтем 2' },
        { id: 3, parent: 1, label: 'Айтем 3' },
      ])
    })

    it('should return empty array if parent id not exist', () => {
      expect(tree.getChildren(100)).toStrictEqual([])
    })
  })

  describe('getAllChildren', () => {
    it('should return array of child elements by parent id recursive', () => {
      expect(tree.getAllChildren(1)).toStrictEqual([
        { id: '2', parent: 1, label: 'Айтем 2' },
        { id: 3, parent: 1, label: 'Айтем 3' },

        { id: 4, parent: '2', label: 'Айтем 4' },
        { id: 5, parent: '2', label: 'Айтем 5' },
        { id: 6, parent: '2', label: 'Айтем 6' },

        { id: 7, parent: 4, label: 'Айтем 7' },
        { id: 8, parent: 4, label: 'Айтем 8' },
      ])
    })

    it('should return empty array if parent id not exist', () => {
      expect(tree.getAllChildren(100)).toStrictEqual([])
    })
  })

  describe('getAllParents', () => {
    it('should return array of parents by child id recursive', () => {
      expect(tree.getAllParents(7)).toStrictEqual([
        { id: 7, parent: 4, label: 'Айтем 7' },
        { id: 4, parent: '2', label: 'Айтем 4' },
        { id: '2', parent: 1, label: 'Айтем 2' },
        { id: 1, parent: null, label: 'Айтем 1' },
      ])
    })

    it('should return parent and child array for the direct child', () => {
      expect(tree.getAllParents(3)).toStrictEqual([
        { id: 3, parent: 1, label: 'Айтем 3' },
        { id: 1, parent: null, label: 'Айтем 1' },
      ])
    })

    it('should return element itself for element without parent', () => {
      expect(tree.getAllParents(1)).toStrictEqual([
        { id: 1, parent: null, label: 'Айтем 1' },
      ])
    })

    it('should return empty array if parent id not exist', () => {
      expect(tree.getAllParents(100)).toStrictEqual([])
    })
  })

  describe('addItem', () => {
    beforeEach(() => {
      tree.addItem({ id: 9, parent: 4, label: 'Айтем 9' })
    })

    it('should add new item to array', () => {
      expect(tree.getAll()).toContainEqual({ id: 9, parent: 4, label: 'Айтем 9' })
    })

    it('should add link if parent given', () => {
      expect(tree.getChildren(4)).toContainEqual({ id: 9, parent: 4, label: 'Айтем 9' })

      expect(tree.getAllParents(9)).toContainEqual({ id: 4, parent: '2', label: 'Айтем 4' })
    })
  })

  describe('removeItem', () => {
    beforeEach(() => {
      tree.removeItem('2')
    })

    it('should remove element by id', () => {
      expect(tree.getAll()).not.toContainEqual(
        { id: '2', parent: 1, label: 'Айтем 2' }
      )
    })

    it('should remove all children', () => {
      expect(tree.getAll()).toStrictEqual([
        { id: 1, parent: null, label: 'Айтем 1' },
        { id: 3, parent: 1, label: 'Айтем 3' },
      ])

      expect(tree.getAllChildren('2')).toStrictEqual([])
    })
  })

  describe('updateItem', () => {
    it('should update item value by id', () => {
      tree.updateItem({ id: 3, parent: '2', label: 'Айтем 3' })
      expect(tree.getAll()).toContainEqual({ id: 3, parent: '2', label: 'Айтем 3' })
    })

    it('should add new item to array if given item not find by id', () => {
      tree.updateItem({ id: 9, parent: 4, label: 'Айтем 9' })
      expect(tree.getAll()).toContainEqual({ id: 9, parent: 4, label: 'Айтем 9' })
    })

    it('should create new link if old item parent was null', () => {
      tree.addItem({ id: 10, parent: null, label: 'Айтем 10' })
      tree.updateItem({ id: 10, parent: '2', label: 'Айтем 10' })

      expect(tree.getAll()).toContainEqual({ id: 10, parent: '2', label: 'Айтем 10' })
      expect(tree.getAllChildren('2')).toContainEqual({ id: 10, parent: '2', label: 'Айтем 10' })
      expect(tree.getAllParents(10)).toContainEqual({ id: '2', parent: 1, label: 'Айтем 2' })
    })

    it('should remove link if new item parent is null', () => {
      tree.updateItem({ id: '2', parent: null, label: 'Айтем 2' })

      expect(tree.getAll()).toContainEqual({ id: '2', parent: null, label: 'Айтем 2' })
      expect(tree.getAllChildren(1)).not.toContainEqual({ id: '2', parent: null, label: 'Айтем 2' })
      expect(tree.getAllParents('2')).not.toContainEqual({ id: 1, parent: null, label: 'Айтем 1' })
    })

    it('should remove old link and create new if parent change', () => {
      tree.updateItem({ id: '2', parent: 3, label: 'Айтем 2' })

      expect(tree.getAll()).toContainEqual({ id: '2', parent: 3, label: 'Айтем 2' })
      expect(tree.getAllChildren(3)).toContainEqual({ id: '2', parent: 3, label: 'Айтем 2' })
      expect(tree.getAllParents('2')).toContainEqual({ id: 3, parent: 1, label: 'Айтем 3' })
    })
  })
})
