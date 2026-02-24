# LIS Clothing Swap

School uniform swap programme for Leiria International School (Portugal).
Families donate gently-used uniforms; others browse and take items for free.
Staff manage inventory via a protected dashboard.

---

## Tech stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 15 (App Router, Server Components, Server Actions) |
| Database + Auth | Supabase (PostgreSQL + email/password) |
| UI | Tailwind CSS + shadcn/ui |
| Hosting | Vercel |

---

## Local development setup

### 1. Install Node.js

Download the LTS release from <https://nodejs.org> (or use `nvm` / `fnm`).

### 2. Install dependencies

```bash
cd lis-clothing-swap
npm install
```

### 3. Create a Supabase project

1. Go to <https://supabase.com> → New project.
2. Copy your **Project URL** and **anon public key** from
   *Project Settings → API*.

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
# then fill in the two values:
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 5. Run the database migration

In the Supabase dashboard → **SQL Editor**, paste and run:

```
supabase/migrations/0001_initial_schema.sql
```

### 6. Seed the catalog

Still in the SQL Editor, paste and run:

```
supabase/seed.sql
```

This creates ~300 catalog entries (all item types × sizes × applicable genders)
each starting at **quantity 0**.

### 7. Create staff accounts

In Supabase dashboard → **Authentication → Users → Invite user**.
Staff receive an email to set their password. No self-registration is possible.

### 8. Start the dev server

```bash
npm run dev
# Open http://localhost:3000
```

---

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import the repo in <https://vercel.com/new>.
3. Add the two environment variables in the Vercel project settings.
4. Deploy — Vercel auto-builds on every push to `main`.

---

## Project structure

```
src/
  app/
    page.tsx                  # Public inventory browsing (/)
    layout.tsx
    admin/
      login/page.tsx          # Staff login
      dashboard/page.tsx      # Staff dashboard
    api/auth/callback/route.ts
  components/
    ui/                       # shadcn/ui primitives
    public/                   # CategoryTabs, InventoryFilters, InventoryGrid, ItemCard
    admin/                    # AdminInventoryTable, AddStockDialog, AddItemDialog,
                              # TransactionHistory, LoginForm
  lib/
    constants.ts              # Categories, sizes, item types — single source of truth
    supabase/client.ts
    supabase/server.ts
    utils.ts
  actions/
    inventory.ts              # addStock, removeStock, createCatalogItem, updateCatalogItem
    auth.ts                   # login, logout
  types/database.ts           # Hand-written Supabase types
  middleware.ts               # Protects /admin/* routes
supabase/
  migrations/0001_initial_schema.sql
  seed.sql
```

---

## Verification checklist

- [ ] Public page (`/`) shows items, category tabs and filters work, qty badges display correctly
- [ ] Visiting `/admin/dashboard` without login redirects to `/admin/login`
- [ ] Staff can log in and out
- [ ] **+1 Donation** increments quantity on both dashboard and public page
- [ ] **Take** dialog decrements quantity; cannot go below 0
- [ ] **Add New Item** creates a catalog entry with qty 0
- [ ] **Deactivate** hides an item from the public page
- [ ] Transaction history shows every action with staff email, timestamp, qty delta
