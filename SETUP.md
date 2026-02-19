# Development Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### 1. Clone & Install
```bash
git clone <repository-url>
cd soldier-holdings
npm install
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# (See .env.example for available options)
```

### 3. Development Server
```bash
npm run dev
# Opens http://localhost:3000
```

### 4. Testing
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 🛠️ Development Tools

### Code Quality
```bash
# Lint and auto-fix
npm run lint

# Check linting only
npm run lint:check

# Type checking
npm run type-check

# Format code
npm run format

# Check formatting
npm run format:check
```

### Build & Preview
```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## 📋 CI/CD Pipeline

### Automated Workflows
- **Test & Build**: Runs on every push/PR
- **GitHub Pages**: Auto-deploys from main branch
- **Security Scan**: npm audit + CodeQL analysis
- **Performance Audit**: Lighthouse CI on PRs

### GitHub Pages Setup
1. Enable GitHub Pages in repository settings
2. Select source: "GitHub Actions"
3. Push to main branch to trigger deployment

### Environment Variables for CI/CD
- `VITE_APP_NAME`: Application name
- `VITE_APP_VERSION`: Current version
- `VITE_SENTRY_ENVIRONMENT`: Environment (development/production)
- `VITE_BASE_URL`: Base URL for GitHub Pages

## 🔧 Configuration Files

### ESLint (`.eslintrc.json`)
- TypeScript + React rules
- Auto-fix on save (recommended)
- Pre-commit hooks via husky

### Prettier (`.prettierrc`)
- Consistent code formatting
- Integrated with ESLint
- Runs on pre-commit

### Jest (`jest.config.cjs`)
- TypeScript support
- React Testing Library
- Coverage reporting

### Vite (`vite.config.ts`)
- Development server configuration
- Build optimization
- GitHub Pages base URL support

## 🌍 Environment Variables

### Development (.env)
```bash
VITE_APP_NAME=Soldier Holdings
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_DEBUG_MODE=true
VITE_SENTRY_DSN=your_sentry_dsn_here
```

### Production (GitHub Actions)
```bash
VITE_APP_NAME=Soldier Holdings
VITE_SENTRY_ENVIRONMENT=production
VITE_BASE_URL=/repository-name/
```

## 📊 Performance Monitoring

### Lighthouse CI
- Runs on pull requests
- Performance thresholds: 80+
- Accessibility: 90+ (required)
- Results uploaded to temporary storage

### Coverage Reports
- Jest coverage with lcov format
- Uploaded to Codecov (optional)
- Target: 80%+ coverage

## 🔒 Security

### Automated Scans
- npm audit for vulnerabilities
- CodeQL static analysis
- Dependency security checks

### Best Practices
- Environment variables for secrets
- Content Security Policy headers
- HTTPS enforcement in production

## 🚀 Deployment

### GitHub Pages (Automatic)
1. Push to main branch
2. CI/CD pipeline runs tests
3. Build creates optimized assets
4. Deployed to `https://username.github.io/repository-name`

### Manual Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

## 🐛 Troubleshooting

### Common Issues

**Tests failing with import errors**
```bash
# Ensure test files use .tsx extension
# Check jest configuration for TypeScript support
```

**GitHub Pages 404 errors**
```bash
# Verify VITE_BASE_URL matches repository name
# Check build output in dist/ folder
```

**ESLint errors on build**
```bash
npm run lint --fix
# Or disable specific rules in .eslintrc.json
```

### Getting Help
- Check GitHub Actions logs for CI/CD issues
- Review browser console for runtime errors
- Consult technical documentation in `TECHNICAL_ARCHITECTURE.md`

## 📝 Development Workflow

1. Create feature branch from main
2. Make changes with frequent commits
3. Run `npm run lint` and `npm test` locally
4. Push branch and create PR
5. CI/CD runs automated checks
6. Merge to main triggers deployment

---

**Happy coding! 🎉**
