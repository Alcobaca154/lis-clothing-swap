'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RequestDialog } from './RequestDialog'
import type { PublicInventoryItem } from '@/types/database'

interface ItemCardProps {
  item: PublicInventoryItem
}

export function ItemCard({ item }: ItemCardProps) {
  const available = item.quantity > 0
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Card className={`transition-opacity ${!available ? 'opacity-60' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-medium text-sm leading-tight">{item.item_name}</h3>
            <Badge
              variant={available ? 'default' : 'secondary'}
              className="shrink-0 text-xs"
            >
              {available ? `${item.quantity} left` : 'None'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-4 space-y-3">
          <div className="flex gap-2 text-xs text-muted-foreground capitalize">
            <span>{item.gender}</span>
            <span>·</span>
            <span>{item.size}</span>
          </div>
          {available && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setDialogOpen(true)}
            >
              Request
            </Button>
          )}
        </CardContent>
      </Card>

      <RequestDialog
        item={item}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
