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
		className: {
			control: 'text',
		},
		imageItems: {
			control: 'object',
		},
	},
	args: {
		className: 'min-h-screen bg-white p-8',
		imageItems: [
			{
				...image,
				variant: '1/2',
				align: 'start',
			},
			{
				...image,
				variant: '1/3',
				align: 'center',
			},
			{
				...image,
				variant: '1/5',
				align: 'end',
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

export const MixedAlignment = {
	args: {
		imageItems: [
			{
				...image,
				variant: '1/3',
				align: 'start',
			},
			{
				...image,
				variant: '1/3',
				align: 'center',
			},
			{
				...image,
				variant: '1/3',
				align: 'end',
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