# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Legal AI application with Arabic RTL interface.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, Tailwind CSS, shadcn/ui, framer-motion

## Application: المحامي الذكي (Legal AI)

A full-stack Arabic legal AI assistant application.

### Features
- JWT authentication (login/register)
- 6 legal AI personas powered by OpenAI GPT-4o-mini
- Balance/credits system (1 credit per message)
- File upload (PDF, Word, images, text)
- Camera capture
- Voice recording (Web Speech API)
- Legal document generation (contract, defense memo, lawsuit)
- PDF/Word export
- WhatsApp charging flow
- Admin dashboard with user management and statistics

### Admin Account
- Email: `bishoysamy390@gmail.com`
- Password: `Bishosamy2020`
- Balance: 999999 (unlimited)
- Role: admin

### New Users
- Get 10 free credits on registration
- Can charge via WhatsApp

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (backend)
│   └── legal-ai/           # React + Vite frontend
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## API Routes (all under /api)

- `GET /api/healthz` - Health check
- `POST /api/login` - Login with email/password
- `POST /api/register` - Register new user
- `GET /api/me` - Get current user (requires JWT)
- `POST /api/chat` - Send message to AI persona (requires JWT, costs 1 credit)
- `POST /api/upload` - Upload file (requires JWT)
- `POST /api/generate-document` - Generate legal document (requires JWT)
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/stats` - Get statistics (admin only)
- `POST /api/admin/charge` - Charge user balance (admin only)

## DB Schema

- `users` - id, email, password, name, phone, balance, role, created_at
- `conversations` - id, user_id, persona, messages (JSON), created_at
- `transactions` - id, user_id, amount, type, status, created_at

## Environment Variables

- `JWT_SECRET` - JWT signing secret
- `ADMIN_EMAIL` - Admin email
- `ADMIN_PASSWORD` - Admin password
- `OPENAI_API_KEY` - OpenAI API key (optional, uses fallback responses if missing)
- `DATABASE_URL` - PostgreSQL connection string (auto-provisioned)

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`.

- **Always typecheck from the root** — run `pnpm run typecheck`
- After OpenAPI spec changes: run `pnpm --filter @workspace/api-spec run codegen`
- After DB schema changes: run `pnpm --filter @workspace/db run push`

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes in `src/routes/`, middleware in `src/middlewares/`.

- `pnpm --filter @workspace/api-server run dev` — run the dev server

### `artifacts/legal-ai` (`@workspace/legal-ai`)

React + Vite frontend. Arabic RTL interface.

- `pnpm --filter @workspace/legal-ai run dev` — run the dev server
