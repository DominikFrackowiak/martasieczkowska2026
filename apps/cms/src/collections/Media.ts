import type { CollectionConfig } from 'payload'
import { triggerFrontendDeploy } from '../hooks/triggerFrontendDeploy'

export const Media: CollectionConfig = {
  slug: 'media',
  hooks: {
    afterChange: [triggerFrontendDeploy],
    afterDelete: [triggerFrontendDeploy],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'],
    disableLocalStorage: true,
    // Replacements are new Media records, so deployed SSG pages retain their images.
    crop: false,
    focalPoint: false,
  },
}
