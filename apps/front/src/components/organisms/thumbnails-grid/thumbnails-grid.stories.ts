import { thumbnailItemsList } from '../../../data/projects-mock'
import ThumbnailsGridStoryWrapper from './thumbnails-grid-story-wrapper.astro'

const meta = {
	title: 'Organisms/ThumbnailsGrid',

	component: ThumbnailsGridStoryWrapper,

	parameters: {
		layout: 'fullscreen',
	},

	argTypes: {
		thumbnailItemsList: {
			control: 'object',
		},
	},

	args: {
		thumbnailItemsList,
	},
}

export default meta

export const Playground = {}
