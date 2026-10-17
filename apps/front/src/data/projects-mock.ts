import { storyImage } from './story-image'
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

export const projectsMock = [
	{
		slug: 'ganna-glass',
		title: 'Ganna Glass. logo design',
		titleLines: ['Ganna Glass.', 'logo design'],
		category: 'graphic-design',
		thumbnail: {
			...storyImage,
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
					{ ...storyImage, variant: '1/2' },
					{ ...storyImage, variant: '1/3' },
				],
			},
			{
				justify: 'center',
				imageItems: [{ ...storyImage, variant: '2/3' }],
			},
		],
	},
	{
		slug: 'editorial-design',
		title: 'Editorial design',
		titleLines: ['Editorial', 'design'],
		category: 'graphic-design',
		thumbnail: {
			...storyImage,
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
				imageItems: [{ ...storyImage, variant: '1/2' }],
			},
			{
				justify: 'end',
				imageItems: [{ ...storyImage, variant: '1/2' }],
			},
		],
	},
	{
		slug: 'educational-illustration',
		title: 'Educational illustration',
		titleLines: ['Educational', 'illustration'],
		category: 'illustration',
		thumbnail: {
			...storyImage,
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
					{ ...storyImage, variant: 'grow' },
					{ ...storyImage, variant: 'grow' },
					{ ...storyImage, variant: 'grow' },
				],
			},
		],
	},
	{
		slug: 'illustration-for-children',
		title: 'Illustration for children',
		titleLines: ['Illustration', 'for children'],
		category: 'illustration',
		thumbnail: {
			...storyImage,
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
					{ ...storyImage, variant: '1/4' },
					{ ...storyImage, variant: '1/4' },
					{ ...storyImage, variant: '1/4' },
				],
			},
		],
	},
	{
		slug: 'press-illustration',
		title: 'Press illustration',
		titleLines: ['Press', 'illustration'],
		category: 'illustration',
		thumbnail: {
			...storyImage,
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
					{ ...storyImage, variant: '2/5' },
					{ ...storyImage, variant: '2/5' },
				],
			},
		],
	},
	{
		slug: 'branding',
		title: 'Branding',
		titleLines: ['Branding'],
		category: 'graphic-design',
		thumbnail: {
			...storyImage,
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
				imageItems: [{ ...storyImage, variant: '2/3' }],
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

