import IconClickableStoryWrapper from './icon-clickable-story-wrapper.astro'

const iconOptions = ['behance', 'envelope', 'instagram'] as const

const meta = {
	title: 'Atoms/IconClickable',
	component: IconClickableStoryWrapper,
	argTypes: {
		url: {
			control: 'text',
		},
		target: {
			control: 'select',
			options: ['_blank', '_self', '_parent', '_top'],
		},
		ariaLabel: {
			control: 'text',
		},
		className: {
			control: 'text',
		},
		icon: {
			control: 'select',
			options: iconOptions,
		},
		iconClassName: {
			control: 'text',
		},
	},
	args: {
		url: 'https://example.com',
		target: '_blank',
		ariaLabel: 'Instagram',
		className: 'inline-flex items-center justify-center p-2',
		icon: 'instagram',
		iconClassName: 'size-8 text-black',
	},
}

export default meta

export const Playground = {}

export const Behance = {
	args: {
		ariaLabel: 'Behance',
		icon: 'behance',
	},
}

export const Email = {
	args: {
		url: 'mailto:hello@example.com',
		target: '_self',
		ariaLabel: 'Email',
		icon: 'envelope',
	},
}