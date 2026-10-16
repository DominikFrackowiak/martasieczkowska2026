import type { Access, CollectionConfig } from 'payload'
import { triggerFrontendDeploy } from '../hooks/triggerFrontendDeploy'

const authenticated: Access = ({ req }) => Boolean(req.user)

type TitleLine = { text?: unknown }

export function getWorkTitle(lines: unknown): string {
  if (!Array.isArray(lines)) return ''
  return lines
    .map((line: TitleLine) => typeof line?.text === 'string' ? line.text.trim() : '')
    .filter(Boolean)
    .join(' ')
}

export function createWorkSlug(title: string): string {
  return title
    .replace(/[łŁ]/g, character => character === 'Ł' ? 'L' : 'l')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const Works: CollectionConfig = {
  slug: 'works',
  orderable: true,
  labels: { singular: 'Project', plural: 'Projects' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'slug'] },
  access: { read: () => true, create: authenticated, update: authenticated, delete: authenticated },
  hooks: {
    afterChange: [triggerFrontendDeploy],
    afterDelete: [triggerFrontendDeploy],
    beforeValidate: [({ data, originalDoc }) => {
      if (!data) return data
      const description = data.description ?? originalDoc?.description
      const title = getWorkTitle(description?.titleLines)
      if (!title) return data

      return {
        ...data,
        title,
        // Keep published URLs stable when an editor later changes the title.
        slug: originalDoc?.slug || createWorkSlug(title),
      }
    }],
  },
  fields: [
    { name: 'title', type: 'text', required: true, admin: { hidden: true } },
    {
      name: 'slug', type: 'text', required: true, unique: true, index: true,
      admin: { hidden: true },
      validate: (value: unknown) => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
        ? true : 'Use lowercase letters and numbers separated by single hyphens.',
    },
    {
      name: 'category', type: 'select', required: true,
      admin: { description: 'Used by the Graphic design and Illustration filters.' },
      options: [
        { label: 'Graphic design', value: 'graphic-design' },
        { label: 'Illustration', value: 'illustration' },
      ],
    },
    {
      name: 'thumbnail', label: 'Thumbnail', type: 'group', fields: [
        {
          name: 'image', label: 'Image', type: 'upload', relationTo: 'media', required: true,
          admin: { description: 'Image shown for this project in the thumbnail grid.' },
        },
        {
          name: 'titleLines', label: 'Title lines', type: 'array', required: true, minRows: 1,
          admin: { description: 'The project title shown when hovering over the thumbnail. Add one entry per line and drag entries to reorder.' },
          fields: [{ name: 'text', label: 'Line', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'seo', label: 'SEO', type: 'group', fields: [
        { name: 'metaTitle', label: 'Page title', type: 'text', required: true,
          admin: { description: 'The front adds the Marta Sieczkowska prefix.' } },
        { name: 'metaDescription', label: 'Page description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'description', label: 'Project description', type: 'group', fields: [
        { name: 'titleLines', label: 'Title lines', type: 'array', required: true, minRows: 1,
          admin: { description: 'The main project title. Add one entry per displayed line and drag entries to reorder.' },
          fields: [{ name: 'text', label: 'Line', type: 'text', required: true }] },
        { name: 'paragraphs', label: 'Description paragraphs', type: 'array', required: true, minRows: 1,
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
