# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | ✅ Active support  |
| 1.x.x   | ⚠️ Security fixes only |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **DO NOT** create a public GitHub issue
2. Email security concerns to: maitamdev@gmail.com
3. Include a description of the vulnerability and steps to reproduce
4. We will acknowledge receipt within 48 hours
5. We will provide a fix within 7 business days for critical issues

## Security Measures

### Authentication
- Supabase Auth with email/password
- Session management with automatic token refresh
- Password requirements: minimum 8 characters, uppercase, lowercase, number

### Data Protection
- Row Level Security (RLS) on all Supabase tables
- Input validation with Zod schemas on both client and server
- XSS prevention through HTML escaping utilities
- CORS headers configured on Edge Functions

### API Security
- Supabase anonymous key for client-side (limited permissions)
- Service role key restricted to server-side Edge Functions
- Rate limiting on AI API calls
- Environment variables for all secrets

### Client-Side
- No sensitive data stored in localStorage
- Content Security Policy headers recommended for deployment
- Dependency scanning with npm audit
