'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ITEM_TYPES, GENDERS, getSizesForCategory } from '@/lib/constants'

interface InventoryFiltersProps {
  category: string
  activeItemType: string
  activeSize: string
  activeGender: string
}

export function InventoryFilters({
  category,
  activeItemType,
  activeSize,
  activeGender,
}: InventoryFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sizes = getSizesForCategory(category)

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <Select
        value={activeItemType || 'all'}
        onValueChange={(v) => updateParam('item_type', v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Item type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {ITEM_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={activeSize || 'all'} onValueChange={(v) => updateParam('size', v)}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sizes</SelectItem>
          {sizes.map((size) => (
            <SelectItem key={size} value={size}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={activeGender || 'all'} onValueChange={(v) => updateParam('gender', v)}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All genders</SelectItem>
          {GENDERS.map((gender) => (
            <SelectItem key={gender} value={gender} className="capitalize">
              {gender}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
