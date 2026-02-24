'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CATEGORIES } from '@/lib/constants'

interface CategoryTabsProps {
  activeCategory: string
}

export function CategoryTabs({ activeCategory }: CategoryTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleCategoryChange(categoryId: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', categoryId)
    // Reset filters that may not be valid in the new category
    params.delete('size')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Tabs value={activeCategory} onValueChange={handleCategoryChange}>
      <TabsList>
        {CATEGORIES.map((cat) => (
          <TabsTrigger key={cat.id} value={cat.id} className="text-xs sm:text-sm">
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
