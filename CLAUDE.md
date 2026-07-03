# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

This repo is a from-scratch rebuild of [amigoviolao.com](https://amigoviolao.com) (currently a WordPress/Elementor site) using Next.js + Supabase. The rebuild drops the old courses catalog and the members-only area entirely; the target site is just: Home, secondary pages, sales (landing) pages, and the Blog (which already exists on the current site and needs migrating).

Only the **Home page** exists so far, built to visually match the current live site (same sections, same brand colors/font) as a v1 to validate direction before the rest of the site is built. Supabase is not wired up yet.

When in doubt about content/structure for a new page, the live site at amigoviolao.com is the reference — inspect it (colors, copy, layout) rather than guessing.

## Important: Next.js version

This project uses **Next.js 16**, which has breaking changes relative to older training data (APIs, conventions, file structure may differ). Before writing Next.js-specific code, check the relevant guide under `node_modules/next/dist/docs/` (organized as `01-app/`, `02-pages/`, etc.) rather than assuming older Next.js behavior.

## Commands

```bash
npm run dev     # start dev server (Turbopack) at localhost:3000
npm run build   # production build
npm run start   # run a production build
npm run lint    # ESLint (flat config, eslint-config-next core-web-vitals + typescript)
```

There is no test suite configured in this project yet.

## Architecture

- **App Router**, TypeScript, Tailwind CSS v4. Path alias `@/*` maps to `src/*`.
- `src/app/page.tsx` composes the Home page purely by stacking section components from `src/components/` (`Header`, `Hero`, `AudienceStrip`, `WhyLearn`, `Testimonials`, `HowItWorks`, `VideoTestimonials`, `Courses`, `About`, `Footer`). Each section is a self-contained component — add new pages the same way, composing section components rather than writing markup directly in `page.tsx`.
- **Theming**: brand colors and font are defined once in `src/app/globals.css` — raw values live under `:root` as `--brand-*` custom properties, then get mapped to Tailwind color tokens (`--color-primary`, `--color-teal`, `--color-dark`, `--color-charcoal`, `--color-cream`) inside `@theme inline`. Use the Tailwind classes (e.g. `bg-primary`, `text-charcoal`) rather than hardcoding hex values. The font (Poppins) is loaded via `next/font/google` in `src/app/layout.tsx` and exposed as `--font-poppins` → `--font-sans`.
- Brand palette: primary orange `#EF5400`, teal `#48C2C3`, dark `#212121`, charcoal `#3E4548`, cream `#E0E6F2` — pulled directly from the live site's computed styles.
- **Images**: `next.config.ts` whitelists `amigoviolao.com/wp-content/uploads/**` as a remote image pattern — this exists only so components can temporarily hotlink real assets from the current live WordPress site as placeholders. Assets that have been properly sourced live in `public/images/` instead (e.g. the Hero background, downloaded from the site's `Fundo-Home-Site.png`). When replacing a placeholder, download the asset into `public/images/` and update the reference rather than leaving it hotlinked long-term.
- Interactive/client-side pieces (e.g. the tabbed content in `HowItWorks`) are marked `"use client"`; everything else is a server component by default — keep new components server components unless they need state/browser APIs.

## Git / deployment

- Remote: private GitHub repo `Ricardonovais1/amigoviolao` (branch `master`).
- No CI/deployment pipeline configured yet.
