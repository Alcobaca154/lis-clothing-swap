export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminInventoryTable } from '@/components/admin/AdminInventoryTable'
import { TransactionHistory } from '@/components/admin/TransactionHistory'
import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  // Fetch all catalog items with their inventory quantities
  const { data: catalogData } = await supabase
    .from('catalog_items')
    .select(
      `
      id,
      category,
      item_name,
      gender,
      size,
      is_active,
      inventory (
        id,
        quantity
      )
    `
    )
    .order('category')
    .order('item_name')
    .order('gender')
    .order('size')

  type InventoryRelation = { id: string; quantity: number } | null

  const items = (catalogData ?? []).map((item) => {
    const inv = item.inventory as unknown as InventoryRelation
    return {
      id: item.id,
      category: item.category,
      item_name: item.item_name,
      gender: item.gender,
      size: item.size,
      is_active: item.is_active,
      quantity: inv?.quantity ?? 0,
    }
  })

  // Stats
  const totalStock = items.reduce((sum, item) => sum + item.quantity, 0)
  const zeroStockCount = items.filter((item) => item.quantity === 0 && item.is_active).length

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { data: donationRows } = await supabase
    .from('transactions')
    .select('quantity_delta')
    .eq('transaction_type', 'donation')
    .gte('created_at', today.toISOString())

  const donationsToday = (donationRows ?? []).reduce((sum, t) => sum + t.quantity_delta, 0)

  // Recent transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select(
      `
      id,
      staff_email,
      quantity_delta,
      transaction_type,
      note,
      created_at,
      catalog_items (
        item_name,
        gender,
        size,
        category
      )
    `
    )
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Staff Dashboard</h1>
          <p className="text-muted-foreground">LIS Clothing Swap — Inventory Management</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <form action={logout}>
            <Button variant="outline" type="submit" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total items in stock</p>
          <p className="text-4xl font-bold mt-1">{totalStock}</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Active types with zero stock</p>
          <p className="text-4xl font-bold mt-1">{zeroStockCount}</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Items donated today</p>
          <p className="text-4xl font-bold mt-1">{donationsToday}</p>
        </div>
      </div>

      {/* Inventory table */}
      <h2 className="text-xl font-semibold mb-4">Inventory</h2>
      <AdminInventoryTable items={items} />

      {/* Transaction log */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <TransactionHistory transactions={(transactions ?? []) as any} />
    </div>
  )
}
