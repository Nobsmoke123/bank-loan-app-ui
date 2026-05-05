# Loan App UI

A modern loan management frontend built with Next.js 14, TypeScript, and Tailwind CSS.

This project provides an end-to-end client-side workflow for:

- user registration and login
- loan application submission
- loan processing (approve/reject)
- repayment tracking and payment recording

The app currently uses a browser `localStorage` store for persistence and session state.

## Tech Stack

- `Next.js 14` (App Router)
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
NEXT_LOAN_SERVICE_API_URL=<your-backend-base-url>
```

> Note: Current UI pages rely on the local `lib/store.ts` implementation.  
> The API layer (`lib/api.ts`, `lib/client.ts`) is available for backend integration.

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

## Data Model (Client-Side Store)

Defined in `lib/store.ts`.

### `User`

- `id: string`
- `name: string`
- `email: string`
- `password: string`

### `Loan`

- `id: string`
- `userId: string`
- `userName: string`
- `userEmail: string`
- `amount: number`
- `durationInMonths: number`
- `status: "pending" | "active" | "completed" | "rejected"`
- `appliedAt: string`
- `monthlyPayment: number`
- `paidAmount: number`

### Storage Keys

- `loan_app_users`
- `loan_app_loans`
- `loan_app_session`

## Business Logic Notes

- Interest basis is currently `12%` annual.
- Monthly payment is calculated with an amortization formula when applying.
- Repayment uses remaining balance logic:
  - payment is capped at outstanding balance
  - loan status flips to `completed` when fully paid
- Loan processing can move pending loans to:
  - `active` (approved)
  - `rejected`

## API Layer (Prepared for Backend Integration)

The following utilities exist but are not yet wired into route pages:

- `lib/api.ts`: generic `apiFetch<T>()`
  - prepends `NEXT_LOAN_SERVICE_API_URL`
  - sends JSON headers
  - includes credentials for cookie-based auth
- `lib/client.ts`: helper functions for endpoints such as:
  - auth (`/auth/login`, `/auth/register`, `/auth/logout`, `/auth/me`)
  - loans (`/loans`, `/loans/:id`, `/loans/:id/repay`)

This makes it straightforward to migrate from local storage to a live backend.

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
- `pnpm lint` - run Next.js lint checks

## Known Limitations

- Data persistence is browser-local only (`localStorage`):
  - different browsers/devices do not share state
  - clearing browser storage resets data
- Authentication is client-side and intended for demo/prototype flows.
- Role-based access control is not enforced (all logged-in users can access processing view).

## Next Steps (Suggested)

- Connect pages to `lib/client.ts` for real API-backed operations.
- Move auth/session handling to secure HTTP-only cookies and server-side checks.
- Add route guards at middleware/server layer.
- Add tests (unit + integration) for store logic and page flows.
- Introduce role-based permissions for loan processing actions.

## License

No license file is currently defined in this repository.
