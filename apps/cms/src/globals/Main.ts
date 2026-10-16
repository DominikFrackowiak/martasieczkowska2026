import type { GlobalConfig } from 'payload'

export const Main: GlobalConfig = {
  slug: 'main',
  label: 'Main',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'seo', label: 'SEO', type: 'group', fields: [
        { name: 'metaTitle', type: 'text', required: true,
          defaultValue: 'Graphic Designer & Illustrator',
          admin: { description: 'Page title. The front adds the Marta Sieczkowska prefix.' } },
        { name: 'metaDescription', type: 'textarea', required: true,
          defaultValue: 'Explore the portfolio of Marta Sieczkowska, a Polish graphic designer and illustrator working across visual identities, typography, editorial design and illustration.' },
      ],
    },
  ],
}
