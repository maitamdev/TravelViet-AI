# Contributing to TravelViet AI

Thank you for your interest in contributing! Here's how to get started.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/TravelViet-AI.git`
3. Install dependencies: `npm install`
4. Copy environment file: `cp .env.example .env`
5. Add your Supabase credentials to `.env`
6. Start dev server: `npm run dev`

## Coding Standards

- **TypeScript**: Use strict typing, avoid `any` where possible
- **Components**: Functional components with hooks only
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Files**: One component per file, colocate tests
- **Imports**: Use absolute paths with `@/` prefix
- **Styling**: Use Tailwind CSS classes, avoid inline styles

## Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) spec:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `test:` Adding or updating tests
- `refactor:` Code refactoring
- `style:` Code style changes (formatting, etc.)
- `chore:` Maintenance tasks
- `perf:` Performance improvements

## Pull Request Process

1. Create your feature branch: `git checkout -b feature/my-feature`
2. Write tests for new functionality
3. Ensure all tests pass: `npm test`
4. Ensure no lint errors: `npm run lint`
5. Commit your changes following the commit convention
6. Push to your fork and create a Pull Request
7. Fill out the PR template with relevant information

## Code Review

All PRs require at least one review before merging. Reviewers will check:
- Code quality and readability
- Test coverage
- Performance implications
- Accessibility compliance
- Vietnamese language support

## Reporting Issues

Use GitHub Issues with these labels:
- `bug` - Something isn't working
- `feature` - New feature request
- `docs` - Documentation improvements
- `question` - General questions
