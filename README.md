# Marta Sieczkowska — Portfolio

![Marta Sieczkowska — portfolio artwork](https://res.cloudinary.com/dluws4pqk/image/upload/f_auto,q_auto,c_limit,w_1196/v1792008238/b4d4d547-dac0-43e7-8c89-9d9b885d2132.webp)

A portfolio for graphic designer and illustrator Marta Sieczkowska.
Built with Astro and a headless Payload CMS, with responsive project
galleries and a focus on typography and imagery.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | Astro, TypeScript, Tailwind CSS |
| CMS | Payload CMS, Next.js, React, Lexical |
| Database | MongoDB |
| Media | Cloudinary |
| Components | Storybook with Vite |
| Validation | Zod |
| Testing | Vitest, Playwright, Testing Library |
| Workspace | pnpm |
| Deployment | Vercel |

## Features

- Static pages generated from CMS content.
- Flexible gallery layouts for different image sizes and proportions.
- Project filtering with the selected category reflected in the URL.
- CMS-managed projects, homepage, about page, and SEO metadata.
- Cloudinary media storage and delivery.

## Project structure

```text
apps/
├── front/       # Astro website
├── cms/         # Payload CMS and Next.js admin panel
└── storybook/   # Component development and documentation
```

## Local development

Requires Node.js ≥22.12.0, pnpm 10.19.0, MongoDB, and a Cloudinary account.

```sh
git clone https://github.com/DominikFrackowiak/martasieczkowska2026.git
cd martasieczkowska2026
pnpm install
```

Create `.env` files from `.env.example` in `apps/front` and `apps/cms`.
Configure the CMS URL, database connection, Payload secret, and Cloudinary
credentials using the examples.

```sh
pnpm dev             # Start all applications
pnpm dev:front       # Astro website
pnpm dev:cms         # Payload CMS
pnpm dev:storybook   # Storybook
```

The CMS must be available when developing or building the frontend,
which fetches content during page generation.

## Credits

- Artwork and graphic design: Marta Sieczkowska
- Web development: Dominik Frackowiak

Artwork and portfolio images remain the property of their respective
creators. Public access to the source code does not grant permission
to reuse them.
