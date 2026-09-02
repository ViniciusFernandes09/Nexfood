# 📖 NexFood

Um livro de receitas digital pessoal — moderno, aconchegante e funcional.

## ✨ Funcionalidades

- Cadastrar, editar, excluir e visualizar receitas
- Pesquisa em tempo real (nome, ingredientes, categoria, tags, descrição)
- Filtros (categoria, dificuldade, tempo, avaliação, favoritas) e ordenação
- Favoritar receitas
- Categorias padrão + categorias personalizadas
- Ingredientes e modo de preparo dinâmicos (adicionar/remover/reordenar)
- Página de detalhes com checklist de ingredientes e etapas (ótima para usar
  enquanto você cozinha)
- Observações pessoais e avaliação em estrelas
- Modo claro / escuro
- Exportar e importar todas as receitas em JSON
- Totalmente responsivo (desktop, tablet e celular)
- Dados persistidos no `localStorage` — continuam lá após recarregar a página

## 🧱 Tecnologias

- React 18 + TypeScript
- Vite
- React Router v6
- Lucide React (ícones)
- CSS puro, com variáveis para o tema claro/escuro (sem framework de CSS)
- `localStorage` como camada local (sempre disponível, funciona offline)
- Supabase (Postgres + Auth) opcional, para login e sincronização entre
  dispositivos — veja a seção dedicada abaixo

## 🚀 Como executar

### Opção mais simples: clicar duas vezes (sem digitar nada)

O projeto já vem com 3 atalhos prontos na pasta raiz, para quem prefere não
usar o terminal:

| Arquivo | O que faz |
|---|---|
| **`1 - Instalar.bat`** | Instala tudo que o projeto precisa (rode uma vez só, ou de novo se atualizar o código) |
| **`2 - Abrir app.bat`** | Abre o app no navegador (modo desenvolvimento) |
| **`3 - Gerar executavel.bat`** | Gera o instalador `.exe` para Windows (ícone na área de trabalho) |

Basta dar **duplo clique** em cada um, na ordem: primeiro o `1`, depois o `2`
(para usar direto no navegador) ou o `3` (para gerar o `.exe` e instalar de
verdade). Uma janela preta (terminal) vai abrir mostrando o progresso — isso
é normal, é só deixar rodando. Se o Windows mostrar um aviso do
"Windows protegeu o computador" (SmartScreen), clique em **"Mais
informações"** → **"Executar assim mesmo"** (isso acontece porque o arquivo
não tem uma assinatura digital paga, não porque há algo de errado).

> ⚠️ Pré-requisito, mesmo com os `.bat`: você precisa ter o
> [Node.js](https://nodejs.org) instalado no Windows (baixe a versão "LTS").
> Sem ele, o `1 - Instalar.bat` não vai funcionar. É uma instalação simples,
> só clicar em "Next" no instalador do site.

### Opção via terminal (para quem preferir)

Pré-requisitos: [Node.js](https://nodejs.org) 18 ou superior.

```bash
# 1. Instale as dependências
npm install

# 2. Rode o servidor de desenvolvimento
npm run dev

# 3. Abra o endereço mostrado no terminal (geralmente http://localhost:5173)
```

Outros comandos úteis:

```bash
npm run build     # gera a versão de produção em /dist
npm run preview   # serve a build de produção localmente
```

## 🖥️ Gerando um executável para Windows (ícone na área de trabalho)

O projeto já vem preparado com [Electron](https://www.electronjs.org/) para
rodar como um app de desktop de verdade — janela própria, sem abas de
navegador. Para gerar o instalador `.exe`:

```bash
# 1. Instale as dependências (inclui electron e electron-builder)
npm install

# 2. Gere o instalador do Windows
npm run dist:win
```

Isso vai:

1. Rodar `npm run build` (gera a versão de produção em `/dist`).
2. Empacotar tudo com o Electron e criar um instalador em `release/`, algo
   como `release/NexFood Setup 1.0.0.exe`.

**Depois é só:**

1. Ir até a pasta `release/` e rodar o instalador gerado (duplo clique).
2. Seguir o assistente de instalação — ele já vem configurado para criar
   automaticamente um atalho na área de trabalho e no menu Iniciar.
3. Pronto! Um ícone "NexFood" vai aparecer na sua área de
   trabalho, abrindo o app numa janela própria, sem barra de endereço nem
   abas de navegador.

Detalhes técnicos, caso queira entender ou ajustar:

- `electron/main.cjs` é o processo principal do Electron: cria a janela e
  carrega o `dist/index.html` já compilado (por isso é preciso rodar o
  build antes de empacotar).
- A rota do app foi trocada de `BrowserRouter` para `HashRouter` (em
  `src/App.tsx`) — necessário porque, dentro do Electron, o app é carregado
  como arquivo local (`file://`), e o `HashRouter` (URLs como `#/recipes`)
  funciona sem precisar de um servidor por trás, mesmo se a janela for
  recarregada.
- `vite.config.ts` usa `base: './'` para que os arquivos JS/CSS gerados
  sejam referenciados com caminhos relativos — essencial para funcionar via
  `file://`.
- A configuração do empacotador (`electron-builder`) está no bloco `"build"`
  do `package.json`.
- **Ícone personalizado (opcional):** por padrão o instalador usa o ícone
  genérico do Electron. Se quiser usar um ícone próprio, coloque um arquivo
  `icon.ico` (256x256, formato `.ico`) dentro da pasta `electron/` — o
  `main.cjs` já está preparado para usá-lo automaticamente se o arquivo
  existir, e você pode adicionar `"icon": "electron/icon.ico"` dentro do
  bloco `"win"` do `package.json` para o instalador também usá-lo.

> ⚠️ Assim como o restante do projeto, não consegui rodar `npm install` nem
> `npm run dist:win` aqui para testar a geração do `.exe` de ponta a ponta
> (ambiente sem internet). O `electron-builder` normalmente funciona sem
> configuração extra no Windows, mas se aparecer algum erro durante o
> empacotamento, me envie a mensagem que eu ajusto.

Na primeira execução, como não existem receitas salvas ainda, o app carrega
automaticamente 8 receitas de exemplo (Lasanha, Strogonoff, Carbonara, Bolo de
Chocolate, Panqueca, Pizza, Hambúrguer e Brigadeiro) para você já ver o
aplicativo funcionando. Você pode editá-las, excluí-las ou simplesmente usar
"Limpar todos os dados" em Configurações para começar do zero.

## ☁️ Ativando login e sincronização na nuvem (Supabase, opcional)

Por padrão o app funciona **100% local**, sem login — exatamente como antes.
Se você quiser sincronizar suas receitas entre dispositivos (ex: celular e
computador) com login próprio, o projeto já vem pronto para isso usando o
[Supabase](https://supabase.com) (gratuito), no modelo **híbrido**: o app
sempre lê/escreve primeiro no `localStorage` (funciona offline, inclusive na
cozinha com wifi ruim) e sincroniza com a nuvem em segundo plano sempre que
há internet.

**Passo a passo:**

1. Crie uma conta gratuita em [supabase.com](https://supabase.com) e um novo
   projeto (leva ~2 minutos para provisionar).
2. No painel do projeto, abra **SQL Editor** → **New query**, cole todo o
   conteúdo do arquivo [`supabase/schema.sql`](./supabase/schema.sql) deste
   projeto e clique em **Run**. Isso cria as tabelas `recipes` e
   `categories` já com **Row Level Security (RLS)** habilitada — cada
   usuário só enxerga e edita os próprios dados, mesmo que descubra a chave
   pública do projeto.
3. Em **Authentication → Providers**, confirme que **Email** está
   habilitado (vem habilitado por padrão). Se quiser pular a confirmação
   por e-mail (mais prático para uso pessoal), desative "Confirm email" em
   **Authentication → Settings**.
4. Em **Settings → API**, copie a **Project URL** e a chave **anon public**.
5. Na raiz do projeto, copie `.env.example` para um novo arquivo `.env` e
   cole os dois valores:
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```
6. Rode `npm install` (agora inclui `@supabase/supabase-js`) e depois
   `npm run dev` normalmente. Uma tela de login/cadastro vai aparecer antes
   do app — crie sua conta e pronto.

**Como funciona por baixo dos panos:**

- `src/services/supabaseClient.ts` só ativa a conexão com o Supabase se as
  duas variáveis do `.env` estiverem preenchidas. Sem elas, o app roda
  exatamente como antes (sem tela de login).
- `src/context/AuthContext.tsx` cuida de login, cadastro e logout.
- `src/services/syncService.ts` sabe converter uma receita entre o formato
  usado no app e o formato das tabelas do Supabase, e sabe mesclar dados
  locais com dados da nuvem (compara por `updatedAt` — o mais recente
  vence).
- `src/hooks/useSync.ts` roda essa sincronização completa automaticamente
  ao logar e sempre que a conexão com a internet voltar (`window.online`).
  Cada criação/edição/exclusão de receita também já tenta se espelhar na
  nuvem na hora — se estiver offline, isso simplesmente falha em silêncio e
  a próxima sincronização completa resolve.
- Na página **Configurações**, com login ativado, aparece o status da
  sincronização, um botão "Sincronizar agora" e a opção de sair da conta.

**Sobre segurança:** a chave `anon public` do Supabase fica visível no
código do app (é assim que esse tipo de arquitetura funciona) — mas isso não
é um problema porque o RLS do `schema.sql` bloqueia qualquer leitura/escrita
que não seja do próprio usuário autenticado, mesmo que alguém tenha essa
chave em mãos. Nunca compartilhe seu arquivo `.env` publicamente (ele já
está no `.gitignore` deste projeto) nem a senha da sua conta.

### Já configurou o Supabase antes desta versão? Atualize seu banco

Se você já rodou uma versão anterior do `schema.sql`, falta criar a tabela
`tombstones` (usada para lembrar exclusões e evitar que uma receita
excluída "volte" ao sincronizar com outro dispositivo). Rode isso uma vez no
**SQL Editor** do seu projeto (é seguro executar de novo, mesmo se parte já
existir):

```sql
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

NOTIFY pgrst, 'reload schema';
```

(Ou, mais simples: cole o `supabase/schema.sql` inteiro de novo — todos os
comandos usam `if not exists`/`drop policy if exists`, então rodar tudo de
novo não apaga nada que já existe.)

O campo **Nome** (pedido no cadastro, usado para o "Olá, [nome]!" na tela
inicial) não precisa de nenhuma migração — ele é salvo automaticamente pelo
próprio Supabase Auth como metadado da conta.

## 🗂️ Estrutura do projeto

```
src/
  components/     Componentes reutilizáveis (Sidebar, RecipeCard, Modal, etc.)
  pages/          Uma pasta por página/rota (Home, Recipes, RecipeDetails...)
  services/       Camada de acesso a dados (localStorage + sincronização Supabase)
  hooks/          Hooks React (useRecipes, useCategories, useSync, useLocalStorage)
  context/        Contextos globais (tema, notificações/toast, autenticação)
  types/          Interfaces TypeScript (Recipe, Ingredient, Step, Category)
  data/           Receitas e categorias de exemplo (seed inicial)
  utils/          Funções utilitárias puras (formatação de tempo, ids)
  styles/         CSS global, de componentes e de páginas
electron/         Processo principal do Electron (empacotamento para Windows)
supabase/         schema.sql — tabelas e políticas de RLS para o Supabase
```

Cada funcionalidade fica isolada na sua camada: os componentes nunca acessam
o `localStorage` diretamente — eles chamam funções de `services/`, que por
sua vez usam `services/storage.ts` como wrapper genérico.

## 💾 Como os dados são armazenados

**Sem configurar o Supabase (padrão):** tudo fica salvo no `localStorage` do
seu navegador, sob as chaves:

- `meu-livro-de-receitas:recipes`
- `meu-livro-de-receitas:categories`
- `meu-livro-de-receitas:theme`

Isso significa que os dados são **locais a este navegador e a este
computador**. Limpar os dados do navegador (ou usar outro navegador/aba
anônima) fará o app voltar às receitas de exemplo. Por isso a página de
Configurações tem exportação/importação em JSON — use-a para fazer backup
periódico ou migrar seus dados.

**Com o Supabase configurado:** os dados continuam sendo salvos no
`localStorage` primeiro (então o app continua funcionando sem internet), e
são sincronizados automaticamente com o seu projeto Supabase (tabelas
`recipes` e `categories`, protegidas por login e RLS) sempre que há conexão.
Assim você pode abrir o app em outro dispositivo, logar com a mesma conta, e
suas receitas aparecem lá também.

## 🔮 Como evoluir para uma API (ex: Spring Boot)

O projeto já foi organizado pensando nisso. Toda a lógica de dados está
isolada em `src/services/recipeService.ts` e `src/services/categoryService.ts`,
com funções como `getRecipes()`, `createRecipe()`, `updateRecipe()`,
`deleteRecipe()` e `toggleFavorite()` — todas já `async` (retornam Promises),
mesmo hoje usando `localStorage` de forma síncrona por baixo dos panos.

Para trocar por uma API REST no futuro, basta:

1. Reescrever o corpo dessas funções para usar `fetch` (ou `axios`) apontando
   para os endpoints do seu backend (ex: `GET /api/recipes`,
   `POST /api/recipes`, `PUT /api/recipes/:id`, `DELETE /api/recipes/:id`).
2. Manter exatamente as mesmas assinaturas de função.
3. Nenhum componente, página ou hook precisa mudar, porque eles só conhecem
   `recipeService` e `categoryService` — nunca o `localStorage` diretamente.

Isso torna a migração para um backend Spring Boot (ou qualquer outro) uma
mudança isolada e de baixo risco.

## ➕ Como adicionar novas funcionalidades futuramente

- **Novo campo na receita**: adicione o campo em `types/recipe.ts`, no
  formulário (`pages/RecipeForm/RecipeForm.tsx`) e onde for exibido
  (`RecipeCard`, `RecipeDetails`).
- **Nova página**: crie uma pasta em `src/pages/`, registre a rota em
  `src/App.tsx` e, se precisar aparecer no menu, adicione em
  `components/Sidebar/Sidebar.tsx` e `components/MobileNav/MobileNav.tsx`.
- **Novo componente reutilizável**: crie uma pasta em `src/components/`.
- **Nova lógica de dados**: adicione a função no serviço correspondente
  (`recipeService.ts` / `categoryService.ts`) e exponha-a através do hook
  (`useRecipes.ts` / `useCategories.ts`) para os componentes consumirem.

## ⚠️ Limitações e observações importantes

- **Este projeto foi gerado em um ambiente sem acesso à internet**, então
  não foi possível rodar `npm install` nem `npm run build` para validar a
  compilação de fato. O código foi escrito com cuidado (tipagem, imports,
  convenções do React 18 + TypeScript + Vite), mas **você deve rodar
  `npm install` seguido de `npm run dev` (ou `npm run build`) na sua
  máquina para confirmar que compila sem erros**. Se aparecer algum erro de
  TypeScript ou de import, me avise com a mensagem de erro que eu ajusto.
- As imagens das receitas de exemplo apontam para fotos do Unsplash. Se
  algum link de imagem não carregar, o card e a página de detalhes mostram
  automaticamente um ícone de imagem quebrada no lugar (não quebra o
  layout) — e você pode trocar a foto a qualquer momento editando a receita
  e enviando sua própria imagem (fica salva como base64 no `localStorage`).
- Não há backend nesta versão — tudo roda 100% no navegador.
- O upload de imagens usa `FileReader` para converter em base64. Como o
  `localStorage` tem um limite de alguns megabytes por domínio, evite
  cadastrar dezenas de receitas com fotos muito grandes; para um uso
  pessoal com algumas dezenas de receitas isso não deve ser um problema.
- A integração com o Supabase (login, RLS, sincronização) também não pôde
  ser testada de ponta a ponta neste ambiente sem internet. A lógica foi
  escrita seguindo a documentação oficial do Supabase, mas você deve testar
  o fluxo completo (criar conta, logar, criar uma receita, deslogar,
  logar em outro navegador) depois de configurar o `.env`. Se algo não
  sincronizar como esperado, me avise com o erro do console do navegador
  (F12 → aba "Console") que eu ajusto.

## ✅ Checklist do que foi implementado

- [x] Criar, editar, excluir e visualizar receitas
- [x] Pesquisar (nome, ingredientes, categoria, tags, descrição)
- [x] Filtrar (categoria, dificuldade, tempo, avaliação, favoritas)
- [x] Ordenar (recentes, antigas, nome A-Z/Z-A, melhor avaliação)
- [x] Favoritar / desfavoritar
- [x] Categorias padrão + criar/editar/excluir categorias personalizadas
- [x] Ingredientes dinâmicos (adicionar/remover/reordenar)
- [x] Etapas dinâmicas (adicionar/remover)
- [x] Observações pessoais e avaliação em estrelas
- [x] Página de detalhes com checklist de ingredientes e etapas
- [x] Modo claro/escuro persistido
- [x] Exportar/importar receitas em JSON
- [x] Limpar todos os dados (com confirmação)
- [x] Responsivo em desktop, tablet e celular
- [x] Estados vazios, confirmações antes de exclusão e feedback visual (toasts)
- [x] Executável de desktop para Windows (Electron + instalador com atalho)
- [x] Login/cadastro e sincronização híbrida com Supabase (opcional, com RLS)
