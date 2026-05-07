# Loan App UI

A modern loan management frontend built with Next.js, TypeScript, and Tailwind CSS.

This project provides an end-to-end workflow backed by a loan service API for:

- user registration and login
- loan application submission
- loan processing (approve/reject)
- repayment tracking and payment recording

## Tech Stack

- `Next.js 16` (App Router)
- `React 18`
- `TypeScript`
- `Tailwind CSS`
- `pnpm` for package management

## Features

- Authentication flow (register, login, logout)
- Dashboard with loan metrics:
  - total
  - pending
  - active
  - completed
  - rejected
- Loan application form with live repayment preview
- Loan processing screen to approve or reject pending applications
- Repayment screen with:
  - active-loan selector
  - repayment progress bar
  - quick payment amount shortcuts
- Responsive UI with shared top navigation

## Project Structure

```text
.
├── app/
│   ├── dashboard/page.tsx
│   ├── loan-application/page.tsx
│   ├── loan-processing/page.tsx
│   ├── loan-repayment/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── Navbar.tsx
├── lib/
│   ├── api.ts
│   ├── client.ts
│   └── store.ts
├── .env.sample
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+ (Node.js 20+ recommended)
- `pnpm` (the repo is configured with pnpm)

### Installation

```bash
pnpm install
```

### Environment Variables

Copy the sample environment file:

```bash
cp .env.sample .env
```

Set:

```env
LOAN_SERVICE_API_URL=http://localhost:3000
SESSION_SECRET=<your-session-secret>
```

### Run in Development

```bash
pnpm dev
```

The app runs on:

- [http://localhost:3001](http://localhost:3001)

### Production Build

```bash
pnpm build
pnpm start
```

### Lint

```bash
pnpm lint
```

## Available Routes

- `/` - entry redirect (to `/login` or `/dashboard` depending on session)
- `/register` - create account
- `/login` - sign in
- `/dashboard` - user overview and recent applications
- `/loan-application` - submit a new loan request
- `/loan-processing` - review all loans and action pending items
- `/loan-repayment` - make repayments on active loans
- `/loans` - list all loans available to the current user
- `/loans/:id` - view a single loan and its repayments

## Business Logic Notes

- Interest basis is currently `12%` annual.
- Monthly payment is calculated with an amortization formula when applying.
- Repayment uses remaining balance logic:
  - payment is capped at outstanding balance
  - loan status flips to `completed` when fully paid
- Loan processing can move pending loans to:
  - `active` (approved)
  - `rejected`

## API Layer

The app now uses backend-backed authentication and loan APIs:

- `lib/api.ts`: server-side backend fetch helpers
- `app/actions/auth.ts`: login, register, logout server actions
- `app/actions/loans.ts`: apply, repay, and process loan server actions
- `lib/dal.ts`: authenticated user lookup and protected data access

## Styling

- Tailwind theme extension includes custom color palette and typography tokens.
- Shared utility component classes are defined in `app/globals.css`:
  - buttons
  - form inputs
  - labels
  - cards
- Subtle animation helpers are included (`fadeIn`, `slideIn`, staggered transitions).

## Scripts

From `package.json`:

- `pnpm dev` - run Next.js dev server on port `3001`
- `pnpm build` - create production build
- `pnpm start` - start production server
- `pnpm lint` - generate Next route types and run TypeScript checks

## Known Limitations

- The UI expects the backend auth service to be available at `LOAN_SERVICE_API_URL`.
- Name data in session-aware UI is derived from login/register responses or falls back to the email local-part when only `/auth/me` is available.

## Next Steps (Suggested)

- Connect pages to `lib/client.ts` for real API-backed operations.
- Move auth/session handling to secure HTTP-only cookies and server-side checks.
- Add route guards at middleware/server layer.
- Add tests (unit + integration) for store logic and page flows.
- Introduce role-based permissions for loan processing actions.

## License

No license file is currently defined in this repository.
