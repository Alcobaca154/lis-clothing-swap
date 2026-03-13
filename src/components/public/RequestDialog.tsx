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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { sendClothingRequest } from '@/actions/email'
import type { PublicInventoryItem } from '@/types/database'

interface RequestDialogProps {
  item: PublicInventoryItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RequestDialog({ item, open, onOpenChange }: RequestDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function reset() {
    setError(null)
    setSubmitted(false)
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const fd = new FormData(form)

    const quantity = Number(fd.get('quantity'))
    if (!quantity || quantity < 1 || quantity > item.quantity) {
      setError(`Please enter a quantity between 1 and ${item.quantity}.`)
      return
    }

    startTransition(async () => {
      const result = await sendClothingRequest({
        parentName: fd.get('parentName') as string,
        parentEmail: fd.get('parentEmail') as string,
        itemName: item.item_name,
        category: item.category,
        size: item.size,
        gender: item.gender,
        quantity,
        message: (fd.get('message') as string) ?? '',
      })

      if ('error' in result) {
        setError(result.error)
      } else {
        setSubmitted(true)
        setTimeout(() => handleOpenChange(false), 1500)
      }
    })
  }

  const categoryLabel = item.category
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Item</DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="py-6 text-center text-sm font-medium text-green-600">
            ✓ Request sent! We&apos;ll be in touch.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Item summary */}
            <div className="rounded-md bg-muted px-4 py-3 text-sm space-y-0.5">
              <p className="font-medium">{item.item_name}</p>
              <p className="text-muted-foreground capitalize">
                {categoryLabel} · {item.size} · {item.gender}
              </p>
              <p className="text-muted-foreground">{item.quantity} in stock</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentName">Your name</Label>
              <Input id="parentName" name="parentName" required placeholder="Jane Smith" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentEmail">Your email</Label>
              <Input
                id="parentEmail"
                name="parentEmail"
                type="email"
                required
                placeholder="jane@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity needed</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min={1}
                max={item.quantity}
                defaultValue={1}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Any extra details for the admin…"
                rows={3}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Sending…' : 'Send Request'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
