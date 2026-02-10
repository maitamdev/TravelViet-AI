# Development Guide

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git

### Environment Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env`
4. Configure your environment variables
5. Run `npm run dev`

## Development Workflow

### Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `chore/` - Maintenance tasks

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

### Code Style
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful variable names
- Add comments for complex logic

### Testing
```bash
npm run test        # Run tests
npm run test:watch  # Watch mode
npm run build       # Production build
```

## Project Structure

```
src/
├── components/     # React components
├── pages/          # Page components
├── hooks/          # Custom hooks
├── lib/            # Utilities
└── integrations/   # Third-party integrations
```

## Useful Commands

```bash
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run linter
npm run format      # Format code
```

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 5173
npx kill-port 5173
```

**Dependencies out of sync:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
