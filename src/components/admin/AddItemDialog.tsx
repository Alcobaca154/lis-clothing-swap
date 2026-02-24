'use client'

import { useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createCatalogItem } from '@/actions/inventory'
import { CATEGORIES, ITEM_TYPES, GENDERS, getSizesForCategory } from '@/lib/constants'

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddItemDialog({ open, onOpenChange }: AddItemDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedItemType, setSelectedItemType] = useState('')
  const [selectedGender, setSelectedGender] = useState('')
  const [selectedSize, setSelectedSize] = useState('')

  const sizes = selectedCategory ? getSizesForCategory(selectedCategory) : []

  function reset() {
    setSelectedCategory('')
    setSelectedItemType('')
    setSelectedGender('')
    setSelectedSize('')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedCategory || !selectedItemType || !selectedGender || !selectedSize) return

    setError(null)
    startTransition(async () => {
      const result = await createCatalogItem({
        category: selectedCategory,
        item_name: selectedItemType,
        gender: selectedGender,
        size: selectedSize,
      })
      if (result.error) {
        setError(result.error)
      } else {
        reset()
        onOpenChange(false)
      }
    })
  }

  function handleOpenChange(open: boolean) {
    if (!open) reset()
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Catalog Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={(v) => {
                setSelectedCategory(v)
                setSelectedSize('') // reset size when category changes
              }}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Item Type</Label>
            <Select value={selectedItemType} onValueChange={setSelectedItemType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select item type" />
              </SelectTrigger>
              <SelectContent>
                {ITEM_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={selectedGender} onValueChange={setSelectedGender} required>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {GENDERS.map((g) => (
                  <SelectItem key={g} value={g} className="capitalize">
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Size</Label>
            <Select
              value={selectedSize}
              onValueChange={setSelectedSize}
              disabled={!selectedCategory}
              required
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={selectedCategory ? 'Select size' : 'Select category first'}
                />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Adding…' : 'Add Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
