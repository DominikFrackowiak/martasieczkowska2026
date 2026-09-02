import ContentImageStoryWrapper from './content-image-story-wrapper.astro'
import placeholder from './placeholder.png'

const meta = {
	title: 'Atoms/ContentImage',
	component: ContentImageStoryWrapper,
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
		align: {
			control: 'select',
			options: [undefined, 'start', 'center', 'end'],
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
		align: undefined,
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

export const AlignStart = {
	args: {
		variant: '1/2',
		align: 'start',
	},
}

export const AlignCenter = {
	args: {
		variant: '1/2',
		align: 'center',
	},
}

export const AlignEnd = {
	args: {
		variant: '1/2',
		align: 'end',
	},
}