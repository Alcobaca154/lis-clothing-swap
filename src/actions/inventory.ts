'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addStock(catalogItemId: string, delta: number = 1, note?: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.rpc('increment_stock', {
    catalog_item_id: catalogItemId,
    delta,
  })

  if (error) return { error: error.message }

  await supabase.from('transactions').insert({
    catalog_item_id: catalogItemId,
    staff_email: user.email!,
    quantity_delta: delta,
    transaction_type: 'donation',
    note: note || null,
  })

  revalidatePath('/')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function removeStock(catalogItemId: string, delta: number, note?: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.rpc('decrement_stock', {
    catalog_item_id: catalogItemId,
    delta,
  })

  if (error) return { error: error.message }

  await supabase.from('transactions').insert({
    catalog_item_id: catalogItemId,
    staff_email: user.email!,
    quantity_delta: -delta,
    transaction_type: 'taken',
    note: note || null,
  })

  revalidatePath('/')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function createCatalogItem(data: {
  category: string
  item_name: string
  gender: string
  size: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: item, error: itemError } = await supabase
    .from('catalog_items')
    .insert(data)
    .select()
    .single()

  if (itemError) {
    if (itemError.code === '23505') {
      return { error: 'This item already exists in the catalog.' }
    }
    return { error: itemError.message }
  }

  const { error: invError } = await supabase
    .from('inventory')
    .insert({ catalog_item_id: item.id, quantity: 0 })

  if (invError) return { error: invError.message }

  revalidatePath('/admin/dashboard')
  return { success: true, item }
}

export async function updateCatalogItem(id: string, updates: { is_active?: boolean }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('catalog_items')
    .update({ is_active: updates.is_active })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/admin/dashboard')
  return { success: true }
}
