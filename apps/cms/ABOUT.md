# About CMS and Cloudinary

## Configuration

Copy `apps/cms/.env.example` to `apps/cms/.env` and configure MongoDB, a strong
`PAYLOAD_SECRET`, and the Cloudinary cloud name, API key and API secret from the
Cloudinary console. These credentials belong only in the CMS environment, never
in the front or in variables prefixed with `PUBLIC_` / `NEXT_PUBLIC_`.

Run `pnpm dev:cms`, open `/admin`, and create the initial administrator if needed.
Open **About**, review the defaults copied from the existing page, and save.
Select a Media image in **Portrait / Image** before saving.

## Editing images

- **Portrait / Image**: select a Media image or upload a new one from the field.
  Files go to Cloudinary; URL, dimensions and alternative text come from Media.
  Only the optional caption belongs to About.
- To replace the portrait, upload a new Media record and select it in About.
  Uploads receive unique public IDs and versioned URLs.
- Previous Cloudinary assets are retained, including when a Media record is
  deleted or its file replaced. This keeps earlier static deployments working.
  Removing an asset permanently is a separate action in Cloudinary.

Supported uploads: JPEG, PNG, WebP, AVIF and GIF. Uploads pass through the CMS
server. If the CMS is also hosted on Vercel, keep the complete upload request
below its 4.5 MB request-body limit (use images comfortably below that size).

## Migrating the existing portrait

After updating the CMS, run:

```sh
pnpm --filter @martasieczkowska/cms payload migrate
```

The migration copies `portrait.media` to `portrait.image` when the old source was
Media. It verifies the record exists and leaves the old fields in MongoDB for
rollback, without changing the caption or other About content. An already
selected `portrait.image` is kept. No Cloudinary assets are imported or deleted.

For a URL-only portrait, the migration stops with an error. Select an existing
Media record manually or upload the image through the existing Media interface,
then select it in About and save before rerunning. A Cloudinary library asset
alone is not a Payload Media record. Review Media's alternative text: it is now
the text used by the front, replacing About's former duplicate alt field.

## Static front on Vercel

Set `CMS_URL` in `apps/front/.env` locally and in the front's Vercel environment.
Use the CMS origin, for example `https://cms.example.com`, without `/api`.
The CMS must be deployed and reachable from the Vercel build machine.

`pnpm --filter martasieczkowska-astro build` fetches
`/api/globals/about?depth=1` and validates the content. Missing configuration,
an unavailable CMS or invalid content fails the build with an error. There is
no hardcoded fallback, so an unsuccessful build cannot silently publish old
or empty content. The previously successful Vercel deployment remains available.

After saving About, redeploy the front on Vercel. No deploy hook is configured.
The site remains SSG; visitors do not make CMS requests. About is publicly
readable; edits and Media uploads require a logged-in CMS user.

## SEO and image optimization

About includes a required **SEO** group with `metaTitle` and `metaDescription`.
The front uses these in the page title (with the Marta Sieczkowska prefix) and
description meta tag. For an existing About record, fill in these fields and save
before rebuilding the front.

The Cloudinary adapter stores and returns the original versioned URL.
`apps/front/src/lib/cloudinary.ts` adds `f_auto,q_auto` and an optional width
limit when rendering. Existing transformations are kept without duplicating
format, quality or width parameters. Cloudinary URLs use a native `img` and
are not downloaded or re-encoded by Astro. Other remote string URLs are passed
through unchanged; local image imports use Astro's `Image` optimization.

ContentImage retains width variants, dimensions, lazy loading, asynchronous
decoding and semantic captions. It no longer guesses `sizes` from the variant
or site breakpoints. Automatic responsive `srcset` is deferred until each
gallery supplies its actual display sizes. The optional `sizes` prop remains
available. Cloudinary does not need an Astro remote-domain entry with this path.

## Checks

```sh
pnpm --filter @martasieczkowska/cms generate:types
pnpm --filter @martasieczkowska/cms exec tsc --noEmit
pnpm --filter @martasieczkowska/cms lint
pnpm --filter martasieczkowska-astro exec vitest run
```

Real uploads require valid Cloudinary credentials. End-to-end validation also
requires a running MongoDB database and CMS, and a saved About global.
