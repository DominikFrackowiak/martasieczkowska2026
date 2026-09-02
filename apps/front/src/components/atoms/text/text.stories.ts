import Heading from './text.astro'

const meta = {
	title: 'Atoms/Text',
	component: Heading,
	argTypes: {
		as: {
			control: 'select',
			options: ['span', 'p', 'caption'],
		},
		variant: {
			control: 'select',
			options: ['regularText', 'navItem', 'caption'],
		},
		className: {
			control: 'text',
		},
		slots: {
			control: 'object',
		},
	},
	args: {
		as: 'p',
		variant: 'regularText',
		className: '',
		slots: {
			default: 'Heading',
		},
	},
}

export default meta

export const Playground = {}

export const RegularText = {
	args: {
		variant: 'regularText',
		slots: {
			default: 'Lorem ipsum',
		},
	},
}

export const Caption = {
	args: {
		variant: 'caption',
		slots: {
			default: 'foto: Marta Sieczkowska',
		},
	},
}

export const NavItem = {
	args: {
		variant: 'navItem',
		slots: {
			default: 'ABOUT',
		},
	},
}

