import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { PublicInventoryItem } from '@/types/database'

interface ItemCardProps {
  item: PublicInventoryItem
}

export function ItemCard({ item }: ItemCardProps) {
  const available = item.quantity > 0

  return (
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
      <CardContent className="pb-4">
        <div className="flex gap-2 text-xs text-muted-foreground capitalize">
          <span>{item.gender}</span>
          <span>·</span>
          <span>{item.size}</span>
        </div>
      </CardContent>
    </Card>
  )
}
