# GitHub Actions Workflows

This directory contains GitHub Actions workflows for building and deploying Doctorina Pages.

## Workflows

### 🚀 Production Deployment (`deploy-production.yaml`)

Automatically deploys to Firebase Hosting (https://pages.doctorina.com) when:
- Code is pushed to `master` or `main` branch
- Manually triggered via GitHub Actions UI

**Steps:**
1. Build production version
2. Run type checks
3. Deploy to Firebase Hosting live channel

**Required Secrets:**
- `FIREBASE_SERVICE_ACCOUNT` - Firebase service account JSON for deployment

### 🔍 Preview Deployment (`deploy-preview.yaml`)

Creates preview deployments for testing:
- Automatically on pull requests
- Manually via GitHub Actions UI with custom channel name

**Features:**
- Creates temporary preview URLs
- Auto-comments preview URL on PRs
- Configurable expiration (default: 7 days)

**Required Secrets:**
- `FIREBASE_SERVICE_ACCOUNT` - Firebase service account JSON for deployment

### ✅ CI Checks (`ci.yaml`)

Runs on all pull requests and develop branch pushes:
- TypeScript type checking
- ESLint code quality checks
- Build verification

## Setup

### 1. Firebase Service Account

Create a Firebase service account and add it as a GitHub secret:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`doctorina-pages`)
3. Go to Project Settings → Service Accounts
4. Generate new private key
5. Copy the entire JSON content
6. Go to your GitHub repository → Settings → Secrets and variables → Actions
7. Create a new secret named `FIREBASE_SERVICE_ACCOUNT`
8. Paste the JSON content

### 2. Firebase Project Configuration

Ensure your `.firebaserc` contains:

```json
{
  "projects": {
    "default": "doctorina-pages"
  }
}
```

### 3. Manual Deployment

To manually trigger a deployment:

1. Go to Actions tab in GitHub
2. Select the workflow you want to run
3. Click "Run workflow"
4. Fill in any required parameters (for preview deployments)

## Preview Channels

Preview deployments create unique URLs like:
- `https://doctorina-pages--pr-123-xyz.web.app` (for PRs)
- `https://doctorina-pages--preview-xyz.web.app` (manual previews)

These URLs expire after the configured number of days (default: 7).

## Troubleshooting

### Deployment fails with authentication error

Make sure `FIREBASE_SERVICE_ACCOUNT` secret is properly configured with valid JSON.

### Build fails with type errors

Run `npm run type-check` locally to see the errors and fix them before pushing.

### Preview URL not appearing in PR comments

Check that the workflow has `pull-requests: write` permission and the secret is configured.
