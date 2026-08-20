---
title: Supabase
tags: [supabase, postgres, backend, auth, cheatsheet]
aliases: [Supabase Cheatsheet, Supabase Guide]
status: evergreen
---

# Supabase

## 🧠 Core concepts

| Piece | What it is |
|---|---|
| Database | A real Postgres database, full SQL access |
| Auth | User signup/login, JWT-based sessions, OAuth providers |
| Storage | File/object storage (like S3), bucket-based |
| Realtime | Subscribe to live DB changes over websockets |
| Edge Functions | Serverless functions (Deno), deployed close to users |
| RLS | Row Level Security — Postgres-native per-row access control |
| API keys | `anon` key (public, safe client-side w/ RLS), `service_role` key (admin, server-only, bypasses RLS) |

> [!warning] Never expose the `service_role` key client-side. It bypasses RLS entirely — full admin access. `anon` key is the only one meant for browser/mobile code.

## 📦 Setup

```bash
npm install @supabase/supabase-js
pip install supabase
```

```js
// JS
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

```python
# Python
from supabase import create_client
supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
```

> [!tip] Keep `SUPABASE_URL` and keys in environment variables, never hardcoded. `.env` + `.gitignore`, same as any other secret.

## 🖥️ CLI

```bash
npm install -g supabase          # install CLI
supabase login                      # authenticate
supabase init                          # scaffold a local project (creates supabase/ folder)
supabase start                            # spin up local Supabase stack (Docker) — DB, Auth, Storage, Studio
supabase stop                                # stop local stack

supabase link --project-ref <ref>               # link local project to a remote Supabase project
supabase db push                                    # push local migrations to remote DB
supabase db pull                                       # pull remote schema down to local migrations
supabase db reset                                         # reset local DB, replay all migrations

supabase migration new <name>          # create a new migration file
supabase functions new <name>             # scaffold a new edge function
supabase functions deploy <name>             # deploy an edge function
```

> [!tip] `supabase start` needs Docker running — spins up the full stack locally so you can develop without touching production.

## 🗄️ Database — SQL basics

```sql
create table todos (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users not null default auth.uid(),
  task text not null,
  is_complete boolean default false,
  inserted_at timestamptz default now()
);
```

> [!tip] `auth.users` is Supabase's built-in users table. Reference it directly with a foreign key to tie rows to a specific user.

```bash
supabase migration new create_todos_table   # generates a timestamped .sql file in supabase/migrations/
# edit the file, then:
supabase db push
```

## 🔐 Row Level Security (RLS)

RLS is OFF by default when you enable it, meaning **no access at all** until policies are added.

```sql
alter table todos enable row level security;

create policy "Users can view own todos"
  on todos for select
  using (auth.uid() = user_id);

create policy "Users can insert own todos"
  on todos for insert
  with check (auth.uid() = user_id);

create policy "Users can update own todos"
  on todos for update
  using (auth.uid() = user_id);

create policy "Users can delete own todos"
  on todos for delete
  using (auth.uid() = user_id);
```

| Policy clause | Used for |
|---|---|
| `using (...)` | controls which existing rows are visible/affected (select, update, delete) |
| `with check (...)` | controls what NEW/modified row data is allowed (insert, update) |

> [!warning] Forgetting to enable RLS on a table with sensitive data = it's fully public via the API, readable/writable by anyone with the `anon` key. Enable RLS by default on every table, then explicitly add policies.

```sql
create policy "Public read access"
  on todos for select
  using (true);   -- open to everyone, including unauthenticated
```

## 📥 Client queries — select

```js
const { data, error } = await supabase.from('todos').select('*')
const { data, error } = await supabase.from('todos').select('id, task, is_complete')
const { data, error } = await supabase.from('todos').select('*').eq('is_complete', true)
const { data, error } = await supabase.from('todos').select('*').order('inserted_at', { ascending: false })
const { data, error } = await supabase.from('todos').select('*').limit(10)
const { data, error } = await supabase.from('todos').select('*').range(0, 9)   // pagination
```

```python
response = supabase.table("todos").select("*").eq("is_complete", True).execute()
```

### Filters

```js
.eq('col', val)        // equals
.neq('col', val)          // not equals
.gt('col', val)              // greater than
.gte('col', val)                // greater than or equal
.lt('col', val)                    // less than
.lte('col', val)                      // less than or equal
.like('col', '%pattern%')                // LIKE
.ilike('col', '%pattern%')                  // case-insensitive LIKE
.is('col', null)                               // IS (for null/true/false)
.in('col', [1, 2, 3])                             // IN
```

### Joins (foreign table select)

```js
const { data } = await supabase
  .from('todos')
  .select('task, profiles(username)')   // pulls related row from a foreign-keyed table
```

## ➕ Insert / update / delete

```js
const { data, error } = await supabase.from('todos').insert({ task: 'Buy milk' })
const { data, error } = await supabase.from('todos').insert([{ task: 'A' }, { task: 'B' }])   // bulk

const { data, error } = await supabase.from('todos').update({ is_complete: true }).eq('id', 1)

const { data, error } = await supabase.from('todos').delete().eq('id', 1)

const { data, error } = await supabase.from('todos').upsert({ id: 1, task: 'Updated' })   // insert or update
```

> [!tip] Every response returns `{ data, error }` — always check `error` before trusting `data`. It's never thrown as an exception by default in the JS client.

## 👤 Auth

```js
// sign up
const { data, error } = await supabase.auth.signUp({ email, password })

// sign in
const { data, error } = await supabase.auth.signInWithPassword({ email, password })

// OAuth
const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'github' })

// magic link
const { data, error } = await supabase.auth.signInWithOtp({ email })

// sign out
await supabase.auth.signOut()

// get current session
const { data: { session } } = await supabase.auth.getSession()

// get current user
const { data: { user } } = await supabase.auth.getUser()

// listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session)
})
```

> [!note] `auth.uid()` used inside RLS policies (SQL side) automatically resolves to the currently authenticated user's ID from their JWT — that's the whole mechanism tying Auth to RLS together.

## 📁 Storage

```js
// create bucket (or via Studio UI)
await supabase.storage.createBucket('avatars', { public: false })

// upload
const { data, error } = await supabase.storage.from('avatars').upload('user1/avatar.png', file)

// download
const { data, error } = await supabase.storage.from('avatars').download('user1/avatar.png')

// public URL (bucket must be public)
const { data } = supabase.storage.from('avatars').getPublicUrl('user1/avatar.png')

// signed URL (private bucket, temporary access)
const { data, error } = await supabase.storage.from('avatars').createSignedUrl('user1/avatar.png', 60)   // expires in 60s

// list files
const { data, error } = await supabase.storage.from('avatars').list('user1')

// delete
const { data, error } = await supabase.storage.from('avatars').remove(['user1/avatar.png'])
```

> [!tip] Storage buckets support RLS-style policies too (via `storage.objects` table) — same `auth.uid()` pattern to restrict who can upload/read/delete specific paths.

## 🔴 Realtime

```js
const channel = supabase
  .channel('todos-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, (payload) => {
    console.log(payload)
  })
  .subscribe()

// unsubscribe
supabase.removeChannel(channel)
```

| `event` value | Listens for |
|---|---|
| `'INSERT'` | new rows |
| `'UPDATE'` | changed rows |
| `'DELETE'` | removed rows |
| `'*'` | all of the above |

> [!warning] Realtime must be explicitly enabled per table (Studio → Database → Replication, or via SQL `alter publication supabase_realtime add table todos;`). Off by default.

## ⚡ Edge Functions

```bash
supabase functions new hello-world
```

```ts
// supabase/functions/hello-world/index.ts
Deno.serve(async (req) => {
  const { name } = await req.json()
  return new Response(JSON.stringify({ message: `Hello, ${name}!` }), {
    headers: { "Content-Type": "application/json" }
  })
})
```

```bash
supabase functions serve hello-world     # test locally
supabase functions deploy hello-world       # deploy to production
```

```js
// invoke from client
const { data, error } = await supabase.functions.invoke('hello-world', {
  body: { name: 'Amit' }
})
```

## 🧮 Postgres functions + triggers (server-side logic)

```sql
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```
> [!tip] Common pattern: auto-create a `profiles` row whenever a new user signs up, via a trigger on `auth.users`.

## ⚡ Quick setup example

```bash
npm install -g supabase
supabase init
supabase start                       # local stack up, prints local URL + anon key

supabase migration new create_todos
# write the SQL, then:
supabase db push

npm install @supabase/supabase-js
```
```js
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

const { data, error } = await supabase.from('todos').select('*')
console.log(data, error)
```

## 🔗 Scope note

Covers day-to-day Supabase: database, RLS, client queries, auth, storage, realtime, edge functions, CLI. Advanced Postgres features (extensions, full-text search, vector/pgvector for AI embeddings) are a separate, deeper topic worth their own note.
