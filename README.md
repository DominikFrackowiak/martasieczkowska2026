Marta Sieczkowska — Portfolio
A minimalist, content-driven portfolio for Marta Sieczkowska, a Polish graphic designer and illustrator. Built with Astro, TypeScript, and Payload CMS, with a dedicated Storybook for developing and documenting UI components.
The project combines an intentionally simple visual experience with a separate content-management backend. The focus is on typography, imagery, flexible gallery layouts, and making the work itself the centre of attention.
Storybook ↗ · Source code ↗
Tech stack
Area	Technology
Frontend	Astro, TypeScript, Tailwind CSS
CMS	Payload CMS (Next.js)
Database	MongoDB
Media	Cloudinary
Component development	Storybook
Validation & testing	Zod, Vitest
Package management	pnpm workspaces
Deployment	Vercel


Features
- Static, content-driven frontend — Astro generates individual routes for the home page, about page, and projects.
- Headless content management — Payload CMS provides an admin interface for managing projects, descriptions, gallery images, and SEO metadata.
- Flexible project galleries — reusable layouts support single images, paired images, and asymmetric image arrangements.
- Project filtering — browse work by graphic design or illustration, with the selected category represented in the URL.
- Responsive design — layouts and navigation adapt to different screen sizes.
- Component-driven workflow — UI elements are developed and documented in Storybook.
- Cloud-based image management — Cloudinary stores and delivers portfolio imagery.
- Per-page SEO metadata — project-specific titles and descriptions.
Project structure
This repository uses a pnpm monorepo with three applications:
apps/
├── martasieczkowska-astro/   # Public-facing Astro website
├── cms/                     # Payload CMS and admin panel
└── storybook/               # UI component development
The frontend and CMS are deliberately separate: Astro handles presentation and page generation, while Payload manages the content. Storybook provides an isolated environment for reviewing and refining the component library.
Getting started
Prerequisites
- Node.js (a version compatible with the applications' dependencies)
- pnpm 10.19.0
- MongoDB connection
- Cloudinary account for media uploads
Install dependencies
git clone https://github.com/DominikFrackowiak/martasieczkowska2026.git
cd martasieczkowska2026
pnpm install
Configure environment variables
The frontend and CMS require environment configuration. Set up the relevant .env files in their respective application directories using the project's configuration as your source of truth.
The integration uses values such as:
# Frontend: CMS endpoint
CMS_URL=...

# CMS: Cloudinary integration
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
The CMS also requires a database connection and application secrets. Do not commit real credentials to the repository.
Run locally
From the repository root:
# Run all workspace apps in parallel
pnpm dev

# Or start them individually
pnpm dev:front
pnpm dev:cms
pnpm dev:storybook
Design and development approach
The portfolio is intentionally restrained. Rather than adding interactions for their own sake, the interface is designed to give images, project descriptions, and typography room to breathe.
The component system separates reusable presentation elements from page-level content. Gallery components accommodate different image proportions and arrangements, while the CMS lets project content change without rewriting page templates.
The previous version of the site used vanilla JavaScript and a quasi-single-page navigation pattern. This rebuild introduces real routes, a headless CMS, and a component-based architecture, while preserving the original portfolio's visual simplicity.
Credits
- Artwork, illustration, and graphic design: Marta Sieczkowska
- Web development: Dominik Frackowiak
The artwork and images displayed in this portfolio belong to their respective creators and are not provided for reuse simply because the source code is public.
