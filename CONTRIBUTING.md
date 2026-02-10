# Contributing to TravelViet AI

First off, thank you for considering contributing to TravelViet AI! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples**
* **Describe the behavior you observed and what you expected**
* **Include screenshots if possible**
* **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a detailed description of the suggested enhancement**
* **Explain why this enhancement would be useful**
* **List some examples of how it would be used**

### Pull Requests

* Fill in the required template
* Follow the TypeScript/React style guide
* Include screenshots for UI changes
* Update documentation as needed
* Write meaningful commit messages

## Development Process

### Setup Development Environment

1. Fork the repo
2. Clone your fork
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/my-feature`
5. Make your changes
6. Test your changes: `npm run build`
7. Commit: `git commit -m 'feat: add amazing feature'`
8. Push: `git push origin feature/my-feature`
9. Open a Pull Request

### Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

* `feat:` - A new feature
* `fix:` - A bug fix
* `docs:` - Documentation only changes
* `style:` - Code style changes (formatting, etc.)
* `refactor:` - Code refactoring
* `test:` - Adding or updating tests
* `chore:` - Maintenance tasks

Examples:
```
feat(auth): add social login support
fix(ui): resolve button alignment issue
docs: update installation guide
```

### Code Style

* Use TypeScript for type safety
* Follow existing code patterns
* Use meaningful variable names
* Add comments for complex logic
* Keep functions small and focused

### Testing

* Test your changes thoroughly
* Ensure the app builds without errors
* Check responsive design on mobile
* Test authentication flows
* Verify database operations

## Project Structure

```
src/
├── components/     # React components
├── pages/          # Page components
├── hooks/          # Custom hooks
├── lib/            # Utilities
└── integrations/   # Third-party integrations
```

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🚀
