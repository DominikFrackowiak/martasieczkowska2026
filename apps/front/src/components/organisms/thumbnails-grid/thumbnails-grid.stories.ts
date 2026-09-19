import ThumbnailsGridStoryWrapper from './thumbnails-grid-story-wrapper.astro'

import goat from '../../atoms/content-image/goat.jpg'

const image = {
 alt: 'Goat placeholder image',
 src: goat.src,
 intrinsicWidth: goat.width,
 intrinsicHeight: goat.height,
}

const meta = {
 title: 'Organisms/ThumbnailsGrid',

 component: ThumbnailsGridStoryWrapper,

 parameters: {
  layout: 'fullscreen',
 },

 argTypes: {
  thumbnailItemsList: {
   control: 'object',
  },
 },

 args: {
  thumbnailItemsList: [
   {
    slug: 'ganna-glass',
    image,
    titleLines: ['Ganna Glass.', 'logo design'],
   },
   {
    slug: 'editorial-design',
    image,
    titleLines: ['Editorial', 'design'],
   },
   {
    slug: 'educational-illustration',
    image,
    titleLines: ['Educational', 'illustration'],
   },
   {
    slug: 'illustration-for-children',
    image,
    titleLines: ['Illustration', 'for children'],
   },
   {
    slug: 'press-illustration',
    image,
    titleLines: ['Press', 'illustration'],
   },
   {
    slug: 'branding',
    image,
    titleLines: ['Branding'],
   },
  ],
 },
}

export default meta

export const Playground = {}