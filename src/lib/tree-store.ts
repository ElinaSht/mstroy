export type TreeItemId = number | string

export interface TreeItem {
  id: TreeItemId
  parent: null | TreeItemId
  label: string
  [K: string]: any
}

export class TreeStore {
  private items: Map<TreeItemId, TreeItem>
  private childrenLinks: Map<TreeItemId, TreeItemId[]>
  private parentLinks: Map<TreeItemId, TreeItemId>

  constructor(items: TreeItem[]) {
    this.items = new Map()
    this.childrenLinks = new Map()
    this.parentLinks = new Map()

    items.forEach((item) => this.addItem(item))
  }

  private createLink(parentId: TreeItemId, childId: TreeItemId): void {
    if (this.childrenLinks.has(parentId)) {
      this.childrenLinks.get(parentId)!.push(childId)
    } else {
      this.childrenLinks.set(parentId, [childId])
    }

    this.parentLinks.set(childId, parentId)
  }

  private removeLink(parentId: TreeItemId, childId: TreeItemId): void {
    const children = this.childrenLinks.get(parentId)!
    if (children.length > 1) {
      this.childrenLinks.set(
        parentId,
        children.filter((child) => child !== childId),
      )
    } else {
      this.childrenLinks.delete(parentId)
    }

    this.parentLinks.delete(childId)
  }

  getAll(): TreeItem[] {
    return Array.from(this.items.values())
  }

  getItem(id: TreeItemId): TreeItem | undefined {
    return this.items.get(id)
  }

  getChildren(id: TreeItemId): TreeItem[] {
    if (!this.childrenLinks.has(id)) return []

    const ids = this.childrenLinks.get(id)!
    return ids.map((childId) => this.items.get(childId)!)
  }

  getAllChildren(id: TreeItemId): TreeItem[] {
    const ids: TreeItemId[] = []
    let parents: TreeItemId[] = [id]

    while (parents.length > 0) {
      const children = parents.flatMap((parent) => this.childrenLinks.get(parent) ?? [])
      ids.push(...children)
      parents = children
    }

    return ids.map((childId) => this.items.get(childId)!)
  }

  getAllParents(id: TreeItemId): TreeItem[] {
    if (!this.items.has(id)) return []

    const ids: TreeItemId[] = [id]
    let parent: TreeItemId | undefined = this.parentLinks.get(id)

    while (parent !== undefined) {
      ids.push(parent)
      parent = this.parentLinks.get(parent)
    }

    return ids.map((childId) => this.items.get(childId)!)
  }

  addItem(item: TreeItem): void {
    this.items.set(item.id, item)
    console.log(item)
    if (item.parent !== null) {
      this.createLink(item.parent, item.id)
    }
  }

  removeItem(id: TreeItemId): void {
    if (!this.items.has(id)) return

    const candidates = this.getAllChildren(id)
    candidates.push(this.getItem(id)!)

    for (const candidate of candidates) {
      if (candidate.parent !== null) {
        this.removeLink(candidate.parent, candidate.id)
      }
      this.items.delete(candidate.id)
    }
  }

  updateItem(item: TreeItem): void {
    const oldItem = this.items.get(item.id)

    if (!oldItem) return this.addItem(item)

    if (item.parent !== null && oldItem.parent === null) {
      this.createLink(item.parent, item.id)
    } else if (item.parent === null && oldItem.parent !== null) {
      this.removeLink(oldItem.parent, item.id)
    } else if (oldItem.parent !== null && item.parent !== oldItem.parent) {
      this.removeLink(oldItem.parent, item.id)
      this.createLink(item.parent!, item.id)
    }

    this.items.set(item.id, item)
  }
}
