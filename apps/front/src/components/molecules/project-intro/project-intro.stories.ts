import ProjectIntro from './project-intro.astro'

const meta = {
	title: 'Molecules/ProjectIntro',
	component: ProjectIntro,
	argTypes: {
		headingLines: {
			control: 'object',
		},
		descriptionParagraphs: {
			control: 'object',
		},
	},
	args: {
		headingLines: ['Ganna Glass.', 'logo design'],
		descriptionParagraphs: [
			'Ganna Grudnytska is an artist – a glass maker and an illustrator with a style of her own: organic shapes combined with a geometric touch. When I was asked to make a logo for her I took inspiration from her fascination for nature and design. The logo itself forms a hidden signature as there’s a lot of “Gs” in her surname. The branding is to be used on the website, glass prints, business cards, and any other media – it’s simple and universal. ',
		],
	},
}

export default meta

export const Playground = {}

