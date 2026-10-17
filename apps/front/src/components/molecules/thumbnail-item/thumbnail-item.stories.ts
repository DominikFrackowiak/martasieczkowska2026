import ThumbnailItem from './thumbnail-item.astro'
import { storyImage as image } from '../../../data/story-image'

const meta = {
	title: 'Molecules/ThumbnailItem',
	component: ThumbnailItem,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		slug: {
			control: 'text',
		},
		className: {
			control: 'text',
		},
		image: {
			control: 'object',
		},
		titleLines: {
			control: 'object',
		},
	},
	args: {
		slug: 'goat-of-bad-and-good-news',
		className: 'm-8 aspect-[4/3] max-w-xl',
		image,
		titleLines: ['Goat of bad ', 'and good', 'news'],
	},
}

export default meta

export const Playground = {}
