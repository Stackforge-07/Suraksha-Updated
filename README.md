# Suraksha OS

**Learn. Practice. Prepare.**

A disaster-preparedness prototype for schools, with learning activities, decision-based simulations, and dashboards for students, teachers, administrators, and district staff.

Built with **Next.js 16, React 19, TypeScript, Tailwind CSS, Zustand, Recharts, and Supabase integration**.

## What to explore

| Area | Features |
| --- | --- |
| Student | Learning modules, simulations, results, and preparedness recommendations |
| Teacher | Classes, drill management, and student reports |
| Administration | School/building setup, scenarios, drills, and reports |
| District | A district-level dashboard |
| Supporting tools | Preparedness scoring, evacuation logic, charts, and PDF export |

## Run locally

The Next.js application is nested inside `Practice/suraksha-os`. Use Node.js 22 or newer and npm.

```bash
git clone https://github.com/Stackforge-07/Suraksha-Updated.git
cd Suraksha-Updated/Practice/suraksha-os
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000), then visit `/login`.

### Try the staff demo

Choose **Faculty & Admin**, then use a quick-login account or one of these seeded credentials:

| Role | Email | Demo password |
| --- | --- | --- |
| Teacher | `teacher@demo.com` | `demo123` |
| Administrator | `admin@demo.com` | `demo123` |
| District authority | `district@demo.com` | `demo123` |

These are public demo accounts defined in [auth.ts](Practice/suraksha-os/src/lib/auth.ts). Student Access uses a name and class selection.

### Optional Supabase configuration

The application includes Supabase persistence helpers. To configure them, create `.env.local` inside `Practice/suraksha-os`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Review [the database schema](Practice/suraksha-os/supabase/schema.sql) before applying it to a development Supabase project. Restart the development server after changing environment variables. Use the public anon key here, never a service-role key.

Without these variables, the Supabase client is disabled. Database-backed operations require configuration; the seeded staff login is implemented separately.

## Development commands

Run these from `Practice/suraksha-os`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Code map

```text
Practice/suraksha-os/
├── src/app/           Pages and role dashboards
├── src/components/    Shared interface components
├── src/lib/data/      Seeded users, schools, scenarios, and scores
├── src/lib/engines/   Evacuation, scoring, and recommendations
├── src/lib/auth.ts    Demo credential validation
├── src/lib/store.ts   Application state
├── src/lib/supabase.ts
└── supabase/schema.sql
```

## Prototype scope

Authentication uses demo credentials and client-side state; it is not production access control. The project demonstrates preparedness workflows and should not be relied on to direct a real emergency. Deployment with real school data requires secure authentication, authorization, and reviewed database policies.
