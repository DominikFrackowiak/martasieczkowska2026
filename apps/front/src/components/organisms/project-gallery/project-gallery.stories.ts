import ProjectGallery from './project-gallery.astro'
import placeholder from '../../atoms/content-image/placeholder.png'

const image = {
	alt: 'Abstract placeholder image',
	src: placeholder.src,
	intrinsicWidth: placeholder.width,
	intrinsicHeight: placeholder.height,
}

const meta = {
	title: 'Organisms/ProjectGallery',
	component: ProjectGallery,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		className: {
			control: 'text',
		},
		galleryRows: {
			control: 'object',
		},
	},
	args: {
		className: 'min-h-screen bg-white p-8',
		galleryRows: [
			{
				justify: 'between',
				imageItems: [
					{
						...image,
						variant: '1/2',
					},
					{
						...image,
						variant: '1/3',
					},
				],
			},
			{
				justify: 'center',
				imageItems: [
					{
						...image,
						variant: '2/3',
					},
				],
			},
			{
				justify: 'between',
				align: 'end',
				imageItems: [
					{
						...image,
						variant: '1/4',
					},
					{
						...image,
						variant: '1/4',
					},
					{
						...image,
						variant: '1/4',
					},
				],
			},
		],
	},
}

export default meta

export const Playground = {}

export const SingleImageRows = {
	args: {
		galleryRows: [
			{
				justify: 'start',
				imageItems: [
					{
						...image,
						variant: '1/2',
					},
				],
			},
			{
				justify: 'center',
				imageItems: [
					{
						...image,
						variant: '1/2',
					},
				],
			},
			{
				justify: 'end',
				imageItems: [
					{
						...image,
						variant: '1/2',
					},
				],
			},
		],
	},
}

export const DenseGrid = {
	args: {
		galleryRows: [
			{
				imageItems: [
					{
						...image,
						variant: 'grow',
					},
					{
						...image,
						variant: 'grow',
					},
					{
						...image,
						variant: 'grow',
					},
				],
			},
			{
				justify: 'between',
				imageItems: [
					{
						...image,
						variant: '2/5',
					},
					{
						...image,
						variant: '2/5',
					},
				],
			},
		],
	},
}