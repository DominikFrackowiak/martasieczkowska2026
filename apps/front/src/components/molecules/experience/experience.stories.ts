import Experience from './experience.astro'

const meta = {
 title: 'Molecules/Experience',
 component: Experience,

 argTypes: {
  textLines: {
   control: 'object',
  },
 },

 args: {
  textLines: [
   'My experience covers / ranges from:',
   ['editorial design', 'through'],
   ['typography', '"'],
   ['educational illustration', '"'],
   ['illustration for children', '"'],
   ['press illustration', '"'],
   ['infographics', 'to'],
   'branding.',
  ],
 },
}

export default meta

export const Playground = {}