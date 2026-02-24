'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { removeStock } from '@/actions/inventory'

interface TakeStockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: {
    id: string
    item_name: string
    size: string
    gender: string
    quantity: number
  }
}

export function TakeStockDialog({ open, onOpenChange, item }: TakeStockDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const qty = parseInt(formData.get('quantity') as string)
    if (!qty || qty < 1) return

    setLoading(true)
    setError(null)
    const result = await removeStock(item.id, qty, formData.get('note') as string)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Take Items</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {item.item_name} — {item.gender}, {item.size}{' '}
          <span className="font-medium">({item.quantity} available)</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="take-quantity">Quantity to take</Label>
            <Input
              id="take-quantity"
              name="quantity"
              type="number"
              min="1"
              max={item.quantity}
              defaultValue="1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="take-note">Note (optional)</Label>
            <Textarea
              id="take-note"
              name="note"
              placeholder="e.g., Smith family"
              rows={2}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || item.quantity === 0}>
              {loading ? 'Processing…' : 'Confirm'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
