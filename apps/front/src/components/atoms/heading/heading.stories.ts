import Heading from './heading.astro'

const meta = {
	title: 'Atoms/Heading',
	component: Heading,
	argTypes: {
		as: {
			control: 'select',
			options: ['h1', 'h2', 'h3', 'h4', 'h5'],
		},
		variant: {
			control: 'select',
			options: ['project', 'thumbnail'],
		},
		className: {
			control: 'text',
		},
		slots: {
			control: 'object',
		},
	},
	args: {
		as: 'h1',
		variant: 'project',
		className: '',
		slots: {
			default: 'Heading',
		},
	},
}

export default meta

export const Playground = {}

export const Project = {
	args: {
		variant: 'project',
		slots: {
			default: 'Project heading',
		},
	},
}

export const Thumbnail = {
	args: {
		variant: 'thumbnail',
		slots: {
			default: 'Thumbnail heading',
		},
	},
}

