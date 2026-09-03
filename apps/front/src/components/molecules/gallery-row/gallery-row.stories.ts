import GalleryRow from './gallery-row.astro'
import placeholder from '../../atoms/content-image/placeholder.png'

const image = {
	alt: 'Abstract placeholder image',
	src: placeholder.src,
	intrinsicWidth: placeholder.width,
	intrinsicHeight: placeholder.height,
}

const meta = {
	title: 'Molecules/GalleryRow',
	component: GalleryRow,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		align: {
			control: 'select',
			options: ['start', 'center', 'end', 'stretch'],
		},
		justify: {
			control: 'select',
			options: ['start', 'center', 'end', 'between', 'around'],
		},
		className: {
			control: 'text',
		},
		imageItems: {
			control: 'object',
		},
	},
	args: {
		align: 'start',
		justify: 'start',
		className: 'min-h-screen bg-white p-8',
		imageItems: [
			{
				...image,
				variant: '1/2',
			},
			{
				...image,
				variant: '1/3',
			},
			{
				...image,
				variant: '1/5',
			},
		],
	},
}

export default meta

export const Playground = {}

export const EvenPair = {
	args: {
		imageItems: [
			{
				...image,
				variant: '1/2',
			},
			{
				...image,
				variant: '1/2',
			},
		],
	},
}

export const CenteredRow = {
	args: {
		justify: 'center',
		imageItems: [
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
}

export const SpaceBetween = {
	args: {
		justify: 'between',
		imageItems: [
			{
				...image,
				variant: '1/5',
			},
			{
				...image,
				variant: '1/5',
			},
			{
				...image,
				variant: '1/5',
			},
		],
	},
}

export const AlignedEnd = {
	args: {
		align: 'end',
		imageItems: [
			{
				...image,
				variant: '1/4',
			},
			{
				...image,
				variant: '1/3',
			},
		],
	},
}

export const GrowingItems = {
	args: {
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
}