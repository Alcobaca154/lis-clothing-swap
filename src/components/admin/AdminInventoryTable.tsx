'use client'

import { useState, useTransition, useMemo, useOptimistic } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { addStock, removeStock, updateCatalogItem } from '@/actions/inventory'
import { TakeStockDialog } from './AddStockDialog'
import { AddItemDialog } from './AddItemDialog'
import { CATEGORIES } from '@/lib/constants'
import { Plus } from 'lucide-react'

export interface InventoryRow {
  id: string
  category: string
  item_name: string
  gender: string
  size: string
  is_active: boolean
  quantity: number
}

type OptAction =
  | { id: string; type: 'donate' }
  | { id: string; type: 'take'; qty: number }
  | { id: string; type: 'toggle' }

export function AdminInventoryTable({ items }: { items: InventoryRow[] }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [takeItem, setTakeItem] = useState<InventoryRow | null>(null)
  const [addItemOpen, setAddItemOpen] = useState(false)

  const [optimisticItems, applyOptimistic] = useOptimistic(
    items,
    (state: InventoryRow[], action: OptAction) =>
      state.map((item) => {
        if (item.id !== action.id) return item
        if (action.type === 'donate') return { ...item, quantity: item.quantity + 1 }
        if (action.type === 'take') return { ...item, quantity: Math.max(0, item.quantity - action.qty) }
        if (action.type === 'toggle') return { ...item, is_active: !item.is_active }
        return item
      })
  )

  const filtered = useMemo(
    () =>
      optimisticItems.filter((item) => {
        if (categoryFilter !== 'all' && item.category !== categoryFilter) return false
        if (search) {
          const q = search.toLowerCase()
          return (
            item.item_name.toLowerCase().includes(q) ||
            item.gender.toLowerCase().includes(q) ||
            item.size.toLowerCase().includes(q)
          )
        }
        return true
      }),
    [optimisticItems, search, categoryFilter]
  )

  function handleDonate(item: InventoryRow) {
    startTransition(async () => {
      applyOptimistic({ id: item.id, type: 'donate' })
      await addStock(item.id, 1)
      router.refresh()
    })
  }

  function handleToggleActive(item: InventoryRow) {
    startTransition(async () => {
      applyOptimistic({ id: item.id, type: 'toggle' })
      await updateCatalogItem(item.id, { is_active: !item.is_active })
      router.refresh()
    })
  }

  async function handleTake(
    item: InventoryRow,
    qty: number,
    note: string
  ): Promise<{ error?: string }> {
    return new Promise((resolve) => {
      startTransition(async () => {
        applyOptimistic({ id: item.id, type: 'take', qty })
        const result = await removeStock(item.id, qty, note)
        router.refresh()
        resolve(result ?? {})
      })
    })
  }

  const categoryLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id

  return (
    <div>
      <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
        <div className="flex gap-3 flex-1 min-w-0">
          <Input
            placeholder="Search items…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[210px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setAddItemOpen(true)}>
          <Plus className="h-4 w-4" />
          Add New Item
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id} className={!item.is_active ? 'opacity-50' : undefined}>
                  <TableCell className="text-xs text-muted-foreground">
                    {categoryLabel(item.category)}
                  </TableCell>
                  <TableCell className="font-medium">{item.item_name}</TableCell>
                  <TableCell className="capitalize">{item.gender}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>
                    <Badge variant={item.quantity > 0 ? 'default' : 'secondary'}>
                      {item.quantity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.is_active ? 'outline' : 'destructive'}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDonate(item)}
                      >
                        +1 Donation
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setTakeItem(item)}
                        disabled={item.quantity === 0}
                      >
                        Take
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleActive(item)}
                      >
                        {item.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {takeItem && (
        <TakeStockDialog
          open={!!takeItem}
          onOpenChange={(open) => {
            if (!open) setTakeItem(null)
          }}
          item={takeItem}
          onConfirm={handleTake}
        />
      )}

      <AddItemDialog open={addItemOpen} onOpenChange={setAddItemOpen} />
    </div>
  )
}
