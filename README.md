# Travel Idea

B2C visa services platform for exploring destinations, visa options, and sending enquiries. Built as a standalone Vite + React + TypeScript app.

**Company:** Experience Travelidea Private Limited (ISO 9001:2015, IATA accredited)

## Prerequisites

- Node.js 18+ (npm is included)
- A Supabase project (URL and anon/publishable key)

## Setup

```sh
npm install
```

Create a `.env` file in the project root for secrets (do not commit it). Public Vite keys live in `.env.development` / `.env.production`.

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

On Vercel, Vite inlines `VITE_*` at **build** time. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Project Settings → Environment Variables (Production, Preview, Development), or rely on the committed `.env.production` file, then redeploy.

## Scripts

```sh
npm run dev        # development server (http://localhost:8080)
npm run build      # production build
npm run preview    # preview the production build
npm run lint       # ESLint
npm run test       # Vitest (single run)
npm run test:watch # Vitest (watch)
```

## Stack

- React 18, TypeScript, Vite
- Tailwind CSS, shadcn/ui
- Supabase
- React Router, TanStack Query, React Hook Form

## Contact

- Phone: +91 9101197909
- Email: b2b@travelidea.in

**Head office (Tezpur):** Experience Travelidea Private Limited, Ground Floor, G-Square Mall (Sohum Building, Tezpur Main Rd), Tezpur, Assam 784001

**Branch (Kolkata):** Regus Grandeur Offices Private Limited, PS Arcadia, 9th Floor, 4A Camac Street, Kolkata 700016 — +91 33 6651 3201 / 3202
