# Portfolio projects

`Works` is publicly readable; creating, editing and deleting projects requires an authenticated CMS user. No drafts or preview workflow is added. Every saved project is included in the next static frontend build, ordered by creation date.

## Editing

1. Choose Graphic design or Illustration. The stored values match the existing `graphic-design` and `illustration` navigation filters.
2. In **Thumbnail**, select an image from Media and add the title lines shown on hover. Each Media record must have an HTTPS URL, positive width and height, and meaningful alt text.
3. In **Project description**, add the main title lines and description paragraphs. Each array entry is one displayed line or paragraph; drag entries to reorder them.
4. Enter the SEO title without the site-name prefix and a page description.
5. Add gallery rows and images within each row. Choose vertical alignment, horizontal placement and image widths; optionally add captions. Drag rows or images to reorder them.
6. Save and rebuild the Astro frontend with `CMS_URL` pointing to this CMS. Content is fetched at build time, including all API pages with `depth=1`; unavailable or incomplete content fails the build explicitly. An empty Works collection is valid and displays `Sorry, no data to show yet.` where the thumbnail grid normally appears. Media uploads nested in arrays require one relationship level, not extra levels for each array.

The CMS derives its internal project title by joining the **Project description / Title lines** with spaces. On first save it also creates the URL slug by lowercasing the title, removing diacritics and replacing word separators with hyphens (`Farm animals` becomes `farm-animals`). The slug remains unchanged on later edits so published links stay valid. Duplicate generated slugs are rejected by Payload.

## Gallery composition

Gallery images stack at full width below the lg breakpoint and form rows from lg upward. Supported widths are full, grow, halves, thirds, quarters and fifths. All mock compositions are supported: half + third spaced apart, centered two-thirds, a half at the left or right, three growing images, three bottom-aligned quarters, and two spaced two-fifths.

For two equal images use two halves; for an asymmetric pair use two-thirds and one-third. Percent widths are flex bases: when widths plus gaps exceed the row, the existing flex shrink behavior shares the remaining space. Growing images share free space. Captions use the same width on their figure; `min-width: 0` lets figures shrink just like uncaptioned images. Very crowded rows can still make images small, so keep row compositions practical.

## Listing and navigation

Projects support drag-and-drop ordering in the CMS collection list. The frontend fetches projects sorted by Payload's `_order` field. Rebuild the static frontend after changing their order to publish it.

The listing lives on `/` and is also rendered by the shared Layout beneath other pages; `/works` redirects to `/`. All these thumbnails now use Works, preserving the grid, hover titles and `/works/slug` links. Existing category links only toggle the `category` query parameter and active header state: the original grid has no category filtering. That behavior, and navigation links returning to `/`, remain unchanged. No new filtering or category persistence is added.

The `[...slug].astro` route remains to avoid unnecessary routing changes. Slugs are restricted to a single URL segment. Renaming to `[slug].astro` would work for these slugs but offers little benefit for this task.

## Existing mock content and Media setup

`apps/front/src/data/projects-mock.ts` is retained for reference and Storybook. Production pages no longer import it. Its images are local `goat.jpg` and `placeholder.png` imports, not confirmed Media records. There is no automatic migration, upload, overwrite or Cloudinary synchronization.

For the MVP, create or select the correct Media records first, then copy the category, thumbnail content, project description and gallery compositions from the mocks into Works. The CMS generates the URL name. Reuse each existing Media record wherever appropriate. A Cloudinary URL alone does not make an asset selectable in Payload: an existing Cloudinary asset needs a corresponding valid Media record before selection. Do not re-upload an existing asset just to create a duplicate; setting up records for existing remote assets is a separate manual content task using the current integration.

Images use the existing ContentImage component and Cloudinary URL helper. Remote images render as ordinary `img` elements and bypass Astro image processing. The storage adapter is unchanged. CMS edits require a new static build; there is no automatic rebuild hook, live preview or visual gallery editor.

## Verification in this workspace

Payload type generation and CMS `tsc --noEmit` succeeded. Frontend tests cover pagination, Media validation, mapping, gallery compositions, SEO values, URL slugs and request reuse, alongside the existing About, Cloudinary and class-merging tests.

An empty Works collection is covered by tests and is allowed to build with the listing's empty-state message. No CMS content was created or modified. Actual populated Works relationships and visual checks across viewport sizes remain to be verified after adding content.

Astro check reports five existing errors outside the integration: three missing `ariaLabel` props in backward-forward navigation and two implicitly typed `canvasElement` parameters in header Storybook stories. No integration type errors were reported.
