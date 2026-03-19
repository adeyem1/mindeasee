# MindEase Web Application

The MindEase web platform provides accessible mental health support through AI-assisted chat, therapist directory, and curated resources.

## Features

### 🤖 AI Chat Support
- Real-time mental health guidance
- Privacy-focused conversation design
- Custom therapeutic techniques
- Resource recommendations

### 👨‍⚕️ Therapist Directory
- Search filters by specialty, location, and availability
- Detailed professional profiles
- Direct booking system
- Secure messaging

### 📊 Mood Tracking Dashboard
- Daily mood logging
- Pattern visualization
- Trigger identification
- Progress reports

### 📚 Resource Library
- Expert-curated articles
- Guided meditation audio
- Interactive worksheets
- Video content

### 👤 User Profiles
- Custom wellness plans
- Appointment management
- Saved resources
- Progress tracking

## Technology Stack

- **Framework**: Next.js 15
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand 5
- **Authentication**: Firebase Auth 12
- **Database**: Firestore
- **API Integration**: tRPC
- **Testing**: Vitest/Playwright
- **Deployment**: Vercel

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Setup

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_CHATBOT_API_URL=your_chatbot_api_url
```

## Folder Structure

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── chat/             # Chat interface
│   ├── mood-tracker/     # Mood tracking feature
│   ├── profile/          # User profile pages
│   ├── resources/        # Resource library
│   ├── signin/           # Authentication pages
│   ├── signup/           # Registration flow
│   └── therapists/       # Therapist directory
├── components/           # Reusable UI components
│   ├── chat/             # Chat-specific components
│   ├── layout/           # Layout components
│   └── user/             # User-related components
├── services/             # API services
├── store/                # State management
└── types/                # TypeScript type definitions
```

## API Integration

The web application communicates with multiple backend services:

1. **Firebase** - Authentication and database
2. **AI Chat Service** - Mental health chatbot integration
3. **Therapist API** - Professional directory and booking
4. **Resources API** - Content management system

See the [API documentation](../documents/api-documentation.md) for details.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
