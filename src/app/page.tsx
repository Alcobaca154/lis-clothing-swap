import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { CategoryTabs } from '@/components/public/CategoryTabs'
import { InventoryFilters } from '@/components/public/InventoryFilters'
import { InventoryGrid } from '@/components/public/InventoryGrid'
import { CATEGORIES } from '@/lib/constants'

interface SearchParams {
  category?: string
  item_type?: string
  size?: string
  gender?: string
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const activeCategory = params.category ?? CATEGORIES[0].id

  const supabase = await createClient()

  let query = supabase
    .from('public_inventory')
    .select('*')
    .eq('category', activeCategory)

  if (params.item_type) query = query.eq('item_name', params.item_type)
  if (params.size) query = query.eq('size', params.size)
  if (params.gender) query = query.eq('gender', params.gender)

  const { data: items } = await query
    .order('quantity', { ascending: false })
    .order('item_name')
    .order('gender')
    .order('size')

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">LIS Clothing Swap</h1>
        <p className="text-muted-foreground mt-1">
          Browse available school uniforms — all items are free to take.
        </p>
      </header>

      <Suspense>
        <CategoryTabs activeCategory={activeCategory} />
        <InventoryFilters
          category={activeCategory}
          activeItemType={params.item_type ?? ''}
          activeSize={params.size ?? ''}
          activeGender={params.gender ?? ''}
        />
      </Suspense>

      <InventoryGrid items={items ?? []} />
    </main>
  )
}
