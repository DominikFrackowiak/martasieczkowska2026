import ContentImage from './content-image.astro'
import placeholder from './placeholder.png'

const meta = {
	title: 'Atoms/ContentImage',
	component: ContentImage,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		alt: {
			control: 'text',
		},
		variant: {
			control: 'select',
			options: ['full', 'grow', '1/2', '1/3', '2/3', '1/4', '3/4', '1/5', '2/5', '3/5', '4/5'],
		},
		className: {
			control: 'text',
		},
	},
	args: {
		alt: 'Abstract placeholder image',
		src: placeholder.src,
		intrinsicWidth: placeholder.width,
		intrinsicHeight: placeholder.height,
		variant: 'full',
		className: '',
	},
}

export default meta

export const Playground = {}

export const Half = {
	args: {
		variant: '1/2',
	},
}

export const TwoThirds = {
	args: {
		variant: '2/3',
	},
}

export const Quarter = {
	args: {
		variant: '1/4',
	},
}