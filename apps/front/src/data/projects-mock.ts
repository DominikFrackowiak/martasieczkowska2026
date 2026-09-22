import goat from '../components/atoms/content-image/goat.jpg'
import placeholder from '../components/atoms/content-image/placeholder.png'
import type { ContentImageProps } from '../components/atoms/content-image/content-image.astro'
import type { GalleryRowProps } from '../components/molecules/gallery-row/gallery-row.astro'

interface ProjectImage extends ContentImageProps {
	caption?: string
}

export interface ProjectMock {
	slug: string
	title: string
	titleLines: string[]
	category: string
	thumbnail: ProjectImage
	intro: {
		headingLines: string[]
		descriptionParagraphs: string[]
	}
	galleryRows: GalleryRowProps[]
}

export type ProjectThumbnailItem = Pick<ProjectMock, 'slug' | 'titleLines'> & {
	image: ContentImageProps
}

const goatImage = {
	alt: 'Goat placeholder image',
	src: goat,
	intrinsicWidth: goat.width,
	intrinsicHeight: goat.height,
} satisfies ContentImageProps

const placeholderImage = {
	alt: 'Abstract placeholder image',
	src: placeholder,
	intrinsicWidth: placeholder.width,
	intrinsicHeight: placeholder.height,
} satisfies ContentImageProps

export const projectsMock = [
	{
		slug: 'ganna-glass',
		title: 'Ganna Glass. logo design',
		titleLines: ['Ganna Glass.', 'logo design'],
		category: 'Logo design',
		thumbnail: {
			...goatImage,
			alt: 'Ganna Glass logo design thumbnail',
		},
		intro: {
			headingLines: ['Ganna Glass.', 'logo design'],
			descriptionParagraphs: [
				'Ganna Grudnytska is an artist, glass maker, and illustrator with a style of her own: organic shapes combined with a geometric touch.',
			],
		},
		galleryRows: [
			{
				justify: 'between',
				imageItems: [
					{ ...placeholderImage, variant: '1/2' },
					{ ...placeholderImage, variant: '1/3' },
				],
			},
			{
				justify: 'center',
				imageItems: [{ ...placeholderImage, variant: '2/3' }],
			},
		],
	},
	{
		slug: 'editorial-design',
		title: 'Editorial design',
		titleLines: ['Editorial', 'design'],
		category: 'Editorial',
		thumbnail: {
			...goatImage,
			alt: 'Editorial design project thumbnail',
		},
		intro: {
			headingLines: ['Editorial', 'design'],
			descriptionParagraphs: [
				'Editorial layouts, publication systems, and visual pacing for printed and digital stories.',
			],
		},
		galleryRows: [
			{
				justify: 'start',
				imageItems: [{ ...placeholderImage, variant: '1/2' }],
			},
			{
				justify: 'end',
				imageItems: [{ ...placeholderImage, variant: '1/2' }],
			},
		],
	},
	{
		slug: 'educational-illustration',
		title: 'Educational illustration',
		titleLines: ['Educational', 'illustration'],
		category: 'Illustration',
		thumbnail: {
			...goatImage,
			alt: 'Educational illustration project thumbnail',
		},
		intro: {
			headingLines: ['Educational', 'illustration'],
			descriptionParagraphs: [
				'Illustrations designed to make complex subjects easier to understand and friendlier to explore.',
			],
		},
		galleryRows: [
			{
				imageItems: [
					{ ...placeholderImage, variant: 'grow' },
					{ ...placeholderImage, variant: 'grow' },
					{ ...placeholderImage, variant: 'grow' },
				],
			},
		],
	},
	{
		slug: 'illustration-for-children',
		title: 'Illustration for children',
		titleLines: ['Illustration', 'for children'],
		category: 'Illustration',
		thumbnail: {
			...goatImage,
			alt: 'Illustration for children project thumbnail',
		},
		intro: {
			headingLines: ['Illustration', 'for children'],
			descriptionParagraphs: [
				'Warm, characterful illustrations created for young readers, learning materials, and playful narratives.',
			],
		},
		galleryRows: [
			{
				justify: 'between',
				align: 'end',
				imageItems: [
					{ ...placeholderImage, variant: '1/4' },
					{ ...placeholderImage, variant: '1/4' },
					{ ...placeholderImage, variant: '1/4' },
				],
			},
		],
	},
	{
		slug: 'press-illustration',
		title: 'Press illustration',
		titleLines: ['Press', 'illustration'],
		category: 'Illustration',
		thumbnail: {
			...goatImage,
			alt: 'Press illustration project thumbnail',
		},
		intro: {
			headingLines: ['Press', 'illustration'],
			descriptionParagraphs: [
				'Illustrations for articles, interviews, essays, and editorial commentary.',
			],
		},
		galleryRows: [
			{
				justify: 'between',
				imageItems: [
					{ ...placeholderImage, variant: '2/5' },
					{ ...placeholderImage, variant: '2/5' },
				],
			},
		],
	},
	{
		slug: 'branding',
		title: 'Branding',
		titleLines: ['Branding'],
		category: 'Branding',
		thumbnail: {
			...goatImage,
			alt: 'Branding project thumbnail',
		},
		intro: {
			headingLines: ['Branding'],
			descriptionParagraphs: [
				'Brand identity work across logos, visual systems, applications, and communication materials.',
			],
		},
		galleryRows: [
			{
				justify: 'center',
				imageItems: [{ ...placeholderImage, variant: '2/3' }],
			},
		],
	},
] satisfies ProjectMock[]

export const thumbnailItemsList = projectsMock.map(
	({ slug, thumbnail, titleLines }) =>
		({
			slug,
			image: thumbnail,
			titleLines,
		}) satisfies ProjectThumbnailItem
)

