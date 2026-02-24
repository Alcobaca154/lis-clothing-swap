import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface Transaction {
  id: string
  staff_email: string
  quantity_delta: number
  transaction_type: 'donation' | 'taken'
  note: string | null
  created_at: string
  catalog_items: {
    item_name: string
    gender: string
    size: string
    category: string
  } | null
}

export function TransactionHistory({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  No transactions yet
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                    {new Date(t.created_at).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell className="text-sm">
                    {t.catalog_items
                      ? `${t.catalog_items.item_name} — ${t.catalog_items.gender}, ${t.catalog_items.size}`
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.transaction_type === 'donation' ? 'default' : 'secondary'}>
                      {t.transaction_type}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`font-mono font-medium ${
                      t.quantity_delta > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {t.quantity_delta > 0 ? '+' : ''}
                    {t.quantity_delta}
                  </TableCell>
                  <TableCell className="text-sm">{t.staff_email}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.note || '—'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
