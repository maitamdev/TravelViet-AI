# TravelViet AI

AI-powered Travel Assistant for Vietnam

## Project Setup

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm i

# Step 4: Set up environment variables
cp .env.example .env
# Edit .env and add your Supabase credentials

# Step 5: Start the development server
npm run dev
```

## Technologies

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/maitamdev/TravelViet-AI)

#### Manual Deployment Steps

1. **Push your code to GitHub** (if not already done)

2. **Import project to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**:
   - In Vercel project settings, go to "Environment Variables"
   - Add the following variables from your `.env` file:
     ```
     VITE_SUPABASE_PROJECT_ID
     VITE_SUPABASE_PUBLISHABLE_KEY
     VITE_SUPABASE_URL
     ```
   - Make sure to add them for all environments (Production, Preview, Development)

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

#### Troubleshooting Blank Page

If you see a blank page after deployment:

1. **Check Environment Variables**: Ensure all Supabase credentials are set in Vercel
2. **Check Build Logs**: Look for errors in the Vercel deployment logs
3. **Verify vercel.json**: The `vercel.json` file should be present in the root directory
4. **Clear Cache**: Try redeploying with "Clear Cache and Deploy"

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

