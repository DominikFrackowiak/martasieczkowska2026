import type { Field } from 'payload'

export const socialImage = (fallback: string): Field => ({
  name: 'socialImage',
  label: 'Social sharing image',
  type: 'upload',
  relationTo: 'media',
  admin: {
    description: `Optional. Select an existing image from Media. If empty, ${fallback}. The page title and description above are also used when sharing links.`,
  },
})
