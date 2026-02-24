'use client'

import { useState, useTransition, useMemo } from 'react'
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
import { addStock, updateCatalogItem } from '@/actions/inventory'
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

export function AdminInventoryTable({ items }: { items: InventoryRow[] }) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [takeItem, setTakeItem] = useState<InventoryRow | null>(null)
  const [addItemOpen, setAddItemOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [loadingDonateId, setLoadingDonateId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return items.filter((item) => {
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
    })
  }, [items, search, categoryFilter])

  async function handleDonate(item: InventoryRow) {
    setLoadingDonateId(item.id)
    startTransition(async () => {
      await addStock(item.id, 1)
      setLoadingDonateId(null)
    })
  }

  function handleToggleActive(item: InventoryRow) {
    startTransition(async () => {
      await updateCatalogItem(item.id, { is_active: !item.is_active })
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
                        disabled={loadingDonateId === item.id}
                      >
                        {loadingDonateId === item.id ? '…' : '+1 Donation'}
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
                        disabled={isPending}
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
        />
      )}

      <AddItemDialog open={addItemOpen} onOpenChange={setAddItemOpen} />
    </div>
  )
}
