-- =============================================================
-- NexFood — Schema do Supabase
-- =============================================================
-- Como usar:
--   1. Crie um projeto em https://supabase.com (gratuito).
--   2. No painel do projeto, vá em "SQL Editor" > "New query".
--   3. Cole todo o conteúdo deste arquivo e clique em "Run".
--   4. Em "Authentication" > "Providers", confirme que "Email" está
--      habilitado (vem habilitado por padrão).
--   5. (Opcional, recomendado para uso pessoal) Em "Authentication" >
--      "Settings", desative "Confirm email" se não quiser precisar
--      confirmar o cadastro por e-mail toda vez que criar a conta.
--   6. Copie a "Project URL" e a chave "anon public" em
--      "Settings" > "API" e cole no seu arquivo .env (veja .env.example).
-- =============================================================

-- ---------- Tabela: categories ----------

create table if not exists public.categories (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icon text not null,
  custom boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists categories_user_id_idx on public.categories(user_id);

alter table public.categories enable row level security;

drop policy if exists "categories_owner_access" on public.categories;
create policy "categories_owner_access"
  on public.categories
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- Tabela: recipes ----------

create table if not exists public.recipes (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  image text not null default '',
  category text not null default '',
  tags jsonb not null default '[]'::jsonb,
  preparation_time integer not null default 0,
  cooking_time integer not null default 0,
  servings integer not null default 1,
  difficulty text not null default 'facil',
  rating numeric not null default 0,
  favorite boolean not null default false,
  ingredients jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists recipes_user_id_idx on public.recipes(user_id);

alter table public.recipes enable row level security;

drop policy if exists "recipes_owner_access" on public.recipes;
create policy "recipes_owner_access"
  on public.recipes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- Tabela: tombstones (registro de exclusões) ----------
-- Sem isso, quando você exclui uma receita/categoria em um dispositivo,
-- outro dispositivo que ainda tem uma cópia local antiga não tem como saber
-- que ela foi excluída (só vê "existe aqui, não existe na nuvem") e acaba
-- reenviando ela para a nuvem, "ressuscitando" o item excluído.

create table if not exists public.tombstones (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('recipe', 'category')),
  deleted_at timestamptz not null default now(),
  primary key (id, kind, user_id)
);

create index if not exists tombstones_user_id_idx on public.tombstones(user_id);

alter table public.tombstones enable row level security;

drop policy if exists "tombstones_owner_access" on public.tombstones;
create policy "tombstones_owner_access"
  on public.tombstones
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =============================================================
-- Pronto! Cada usuário só consegue ler, criar, editar ou excluir
-- as próprias receitas e categorias (auth.uid() = user_id), mesmo
-- que alguém tenha acesso à chave "anon public" do seu projeto.
-- =============================================================
