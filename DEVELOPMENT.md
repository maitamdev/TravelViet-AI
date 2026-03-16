# Development Guide

## Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **npm** 9+ or **bun**
- **Git**
- **Supabase CLI** (optional, for local development)

## Quick Start

```bash
# Clone and install
git clone https://github.com/maitamdev/TravelViet-AI.git
cd TravelViet-AI
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase project credentials

# Start development server
npm run dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## Project Architecture

### Frontend (React + TypeScript)
- **Vite** for fast HMR and bundling
- **React Router v6** with lazy loading for code splitting
- **TanStack Query** for server state management
- **shadcn/ui** + **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zod** for runtime type validation

### Backend (Supabase)
- **PostgreSQL** database with 16 tables
- **Row Level Security** for data protection
- **Edge Functions** (Deno runtime) for AI processing
- **Realtime** subscriptions for collaboration features

### AI Integration
- **Groq API** with Llama 3.3 70B model
- Streaming responses for real-time chat
- Context-aware trip planning with Vietnamese culture focus

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Run specific test file
npx vitest run src/test/search-utils.test.ts
```

## Troubleshooting

### Common Issues

1. **Build fails with import errors**: Run `npm install` to update dependencies
2. **Supabase connection issues**: Verify `.env` credentials and project status
3. **AI chat not working**: Check GROQ_API_KEY in Supabase Edge Function secrets
4. **Tests failing**: Ensure `jsdom` environment is configured in `vitest.config.ts`
