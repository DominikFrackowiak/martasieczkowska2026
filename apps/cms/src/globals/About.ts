import type { GlobalConfig } from 'payload'
import { triggerFrontendDeploy } from '../hooks/triggerFrontendDeploy'
import { socialImage } from '../fields/socialImage'

const authenticated = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About',
  hooks: { afterChange: [triggerFrontendDeploy] },
  access: { read: () => true, update: authenticated },
  fields: [
    {
      name: 'seo', label: 'SEO', type: 'group', fields: [
        { name: 'metaTitle', type: 'text', required: true, defaultValue: 'About',
          admin: { description: 'Page title. The front adds the Marta Sieczkowska prefix.' } },
        { name: 'metaDescription', type: 'textarea', required: true,
          defaultValue: 'Meet Marta Sieczkowska, a graphic designer and illustrator from Poland. Discover her experience and get in touch.' },
        socialImage('the About portrait is used'),
      ],
    },
    {
      name: 'introduction', type: 'textarea', required: true,
      defaultValue: "Hello, I’m Marta and I'm a graphic designer and illustrator from Poland.",
    },
    {
      name: 'experience', type: 'array', required: true, minRows: 1,
      admin: { description: 'Ordered lines. Leave the right-hand text empty for a single line.' },
      defaultValue: [
        { text: 'My experience covers / ranges from:' },
        { text: 'editorial design', suffix: 'through' },
        { text: 'typography', suffix: "''" },
        { text: 'educational illustration', suffix: "''" },
        { text: 'illustration for children', suffix: "''" },
        { text: 'press illustration', suffix: "''" },
        { text: 'infographics', suffix: 'to' },
        { text: 'branding' },
      ],
      fields: [
        { name: 'text', type: 'text', required: true },
        { name: 'suffix', label: 'Right-hand text', type: 'text' },
      ],
    },
    {
      name: 'paragraphs', type: 'array', required: true, minRows: 1,
      defaultValue: [
        { text: "Sometimes I’m also in charge of children books’ and schoolbooks' layouts, and that's the field of interest I'm pursuing and within which I’m trying to work as often as it's possible." },
        { text: 'I also had the pleasure to conduct workshops with both kids and adults on books and lettering.' },
      ],
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    {
      name: 'portrait', type: 'group', fields: [
        {
          name: 'image', type: 'upload', relationTo: 'media', required: true,
        },
        { name: 'caption', type: 'text', defaultValue: 'fot. Maciej Wróbel' },
      ],
    },
    { name: 'contactLabel', type: 'text', required: true, defaultValue: 'contact me:' },
    { name: 'email', type: 'email', required: true, defaultValue: 'marta.sieczkowska@vp.pl' },
  ],
}
