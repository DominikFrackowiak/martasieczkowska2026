import type { Access, CollectionConfig } from 'payload'

const authenticated: Access = ({ req }) => Boolean(req.user)

export const Works: CollectionConfig = {
  slug: 'works',
  labels: { singular: 'Project', plural: 'Projects' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'slug'] },
  access: { read: () => true, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'title', label: 'Project title', type: 'text', required: true },
    {
      name: 'slug', label: 'URL name', type: 'text', required: true, unique: true,
      admin: { description: 'Used in /works/project-name. Use lowercase letters, numbers and hyphens. Keep this unchanged to preserve existing links.' },
      validate: (value: unknown) => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
        ? true : 'Use lowercase letters and numbers separated by single hyphens.',
    },
    { name: 'category', type: 'select', required: true, options: ['Logo design', 'Editorial', 'Illustration', 'Branding'] },
    { name: 'thumbnail', label: 'Listing image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'titleLines', label: 'Listing title lines', type: 'array', required: true, minRows: 1,
      admin: { description: 'One entry per line shown when hovering over the listing image. Drag entries to reorder.' },
      fields: [{ name: 'text', label: 'Line', type: 'text', required: true }],
    },
    {
      name: 'seo', label: 'SEO', type: 'group', fields: [
        { name: 'metaTitle', label: 'Page title', type: 'text', required: true,
          admin: { description: 'The front adds the Marta Sieczkowska prefix.' } },
        { name: 'metaDescription', label: 'Page description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'intro', label: 'Project introduction', type: 'group', fields: [
        { name: 'headingLines', label: 'Heading lines', type: 'array', required: true, minRows: 1,
          admin: { description: 'One entry per heading line. Drag entries to change their order.' },
          fields: [{ name: 'text', label: 'Line', type: 'text', required: true }] },
        { name: 'descriptionParagraphs', label: 'Description paragraphs', type: 'array', required: true, minRows: 1,
          admin: { description: 'Add one entry for each paragraph. Drag entries to reorder.' },
          fields: [{ name: 'text', label: 'Paragraph', type: 'textarea', required: true }] },
      ],
    },
    {
      name: 'galleryRows', label: 'Gallery rows', type: 'array', required: true, minRows: 1,
      admin: { description: 'Add a row, then choose its images. Drag rows or images to reorder them. Width proportions share the available space with the gaps between images.' },
      fields: [
        { name: 'align', label: 'Vertical alignment', type: 'select', required: true, defaultValue: 'start', options: [
          { label: 'Top', value: 'start' }, { label: 'Center', value: 'center' },
          { label: 'Bottom', value: 'end' }, { label: 'Stretch', value: 'stretch' },
        ] },
        { name: 'justify', label: 'Horizontal placement', type: 'select', required: true, defaultValue: 'start', options: [
          { label: 'Left', value: 'start' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'end' },
          { label: 'Space between images', value: 'between' }, { label: 'Space around images', value: 'around' },
        ] },
        { name: 'images', label: 'Images in this row', type: 'array', required: true, minRows: 1, fields: [
          { name: 'image', label: 'Image', type: 'upload', relationTo: 'media', required: true },
          { name: 'variant', label: 'Image width', type: 'select', required: true, defaultValue: 'full', options: [
            { label: 'Full width', value: 'full' }, { label: 'Grow to available space', value: 'grow' },
            { label: 'One half', value: '1/2' }, { label: 'One third', value: '1/3' }, { label: 'Two thirds', value: '2/3' },
            { label: 'One quarter', value: '1/4' }, { label: 'Three quarters', value: '3/4' },
            { label: 'One fifth', value: '1/5' }, { label: 'Two fifths', value: '2/5' },
            { label: 'Three fifths', value: '3/5' }, { label: 'Four fifths', value: '4/5' },
          ] },
          { name: 'caption', label: 'Caption (optional)', type: 'text' },
        ] },
      ],
    },
  ],
}
