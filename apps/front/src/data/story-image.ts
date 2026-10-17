import type { ContentImageProps } from '../components/atoms/content-image/content-image.astro'

// Hosted images work in static Storybook builds without Astro's image service.
export const storyImage = {
	alt: 'Artwork from Marta Sieczkowska’s portfolio',
	src: 'https://res.cloudinary.com/dluws4pqk/image/upload/f_auto,q_auto,c_limit,w_700/v1792005705/c1c867cb-3e87-4915-99d0-f5881c40f663.webp',
	intrinsicWidth: 700,
	intrinsicHeight: 700,
} satisfies ContentImageProps
