import { ItemCard } from './ItemCard'
import type { PublicInventoryItem } from '@/types/database'

interface InventoryGridProps {
  items: PublicInventoryItem[]
}

export function InventoryGrid({ items }: InventoryGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">No items found</p>
        <p className="text-sm mt-1">Try adjusting your filters or selecting a different category</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
