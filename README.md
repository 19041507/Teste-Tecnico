# Motiron — Teste Técnico (Frontend)

Bem-vindo(a)! Este repositório é uma **base simplificada** de um sistema de
gestão preparada para um **teste técnico de frontend**. O objetivo é avaliar
como você implementa um módulo novo **seguindo os padrões já existentes** no
projeto.

> ⚙️ A aplicação roda **100% mockada, sem backend**. Você não precisa subir API,
> banco de dados nem configurar nada além do `npm install`.

---

## 📌 Resumo do que você precisa fazer

| Desafio | Status | Onde |
| --- | --- | --- |
| **Módulo de Veículos** | ✅ Obrigatório | `src/modules/vehicles` |
| **Dashboard (home)** | ⭐ Opcional (bônus) | `src/app/(private)/(home)/page.tsx` |

- **Veículos:** existe apenas o "esqueleto" (contratos/DTOs/mocks). Você deve
  implementar o módulo completo, espelhando os módulos **Clientes** e **Usuários**
  (que já estão prontos e funcionando). Instruções detalhadas em
  [`src/modules/vehicles/README.md`](src/modules/vehicles/README.md).
- **Dashboard:** desafio **opcional**. Implemente do jeito que achar melhor na
  home (`/`) — use os dados mockados existentes, crie seus próprios mocks ou
  combine os dois. Criatividade é bem-vinda.

---

## 📤 Como participar

1. Baixe este projeto como **arquivo ZIP** (botão **Code → Download ZIP** no GitHub).
2. Descompacte, implemente o desafio e, ao finalizar, compacte a pasta novamente em ZIP.
3. **Envie o ZIP** para o avaliador.

---

## 🚀 Como rodar

Pré-requisitos: **Node.js 20+** e npm.

```bash
npm install
npm run dev
```

Acesse **http://localhost:3000**.

### Login

O login é mockado — **qualquer usuário e senha funcionam**. Exemplo:

- **Usuário:** `demo`
- **Senha:** `demo123`

Quem entra é tratado como **Administrador** (acesso total aos módulos).

> ℹ️ Os dados são mantidos **em memória**. Criar/editar/excluir funciona durante
> a sessão, mas tudo **reseta ao recarregar a página** (F5).

---

## 🧱 Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **TanStack Query** (dados/cache) e **TanStack Table** (tabelas)
- **Zod** (validação de schemas/DTOs)
- **CASL** (permissões por papel)
- **Tailwind CSS** + **shadcn/ui** (componentes)
- **Axios** (camada HTTP — usada como referência de integração real)

---

## 🗂️ Estrutura do projeto

```
src/
├── app/                      # Rotas (App Router)
│   ├── (public)/             # Telas públicas (signin, reset de senha, docs)
│   ├── (private)/            # Telas autenticadas
│   │   ├── (home)/           # Home — alvo do dashboard opcional
│   │   ├── companies/        # Página de Clientes (referência)
│   │   └── users/            # Página de Usuários (referência)
│   └── api/auth/             # Rotas de auth mockadas (signin/refresh/session)
│
├── core/                     # Infra transversal
│   ├── auth/                 # Sessão, cookies, token mock
│   ├── http/                 # Axios + proxy/middleware de rotas
│   └── permissions/          # CASL (abilities, subjects, regras por papel)
│
├── modules/                  # Módulos de domínio
│   ├── companies/            # ✅ Referência (completo)
│   ├── users/                # ✅ Referência (completo)
│   └── vehicles/             # 🛠️ DESAFIO (só contratos + mocks)
│
└── shared/                   # Reutilizáveis
    ├── ui/                   # Componentes (incl. sidebar/menu e tabela)
    ├── hooks/                # Hooks genéricos (ex.: useTableManagement)
    ├── table/               # Helpers de tabela/colunas
    └── mocks/                # Datastore em memória (mock-store)
```

### Referência de organização

Use os módulos `companies` e `users` como referência. Explore como eles estão
organizados (components, hooks, services, types, `index.ts`) e estruture o seu
módulo na mesma linha.

---

## 🛠️ Desafio principal (obrigatório): Módulo de Veículos

Implemente o **módulo `vehicles` completo** — listagem, formulário e
navegação — espelhando os módulos `companies` e `users`. Crie o service, os
hooks, os componentes e o que mais for necessário **com base no que já existe**
nesses módulos.

Pontos a observar:

- Registre a rota do módulo em `src/core/http/proxy/route-config.ts` (a permissão
  `Vehicle` já existe em `core/permissions`).
- Atualize o `index.ts` do módulo com os novos exports.

O que **já vem pronto** (não precisa criar): DTOs, enums e mocks de apoio
(`mocks/vehicle.mocks.ts` e `mocks/api-examples.ts`). Veja também
[`src/modules/vehicles/README.md`](src/modules/vehicles/README.md).

---

## ⭐ Desafio opcional (bônus): Dashboard

Implemente uma **dashboard** na home da aplicação (rota `/`, arquivo
`src/app/(private)/(home)/page.tsx`, que hoje tem só uma tela de boas-vindas).

- Layout, dados e composição são livres — use o que já está mockado, crie
  mocks próprios em `src/modules/<seu-módulo>/data`, ou combine os dois.
- Não é obrigatório; conta como diferencial.

---

Boa sorte! 🚀
