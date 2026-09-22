import HeaderStoryWrapper from './header-story-wrapper.astro'
import { initHeaderNavigation } from './header-navigation'

const meta = {
 title: 'Organisms/Header',
 component: HeaderStoryWrapper,
 parameters: {
  layout: 'fullscreen',
  viewport: {
   options: {
    desktopScreen: {
     name: 'Desktop screen',
     styles: {
      width: '1200px',
      height: '800px',
     },
     type: 'desktop',
    },
    smallScreen: {
     name: 'Small screen',
     styles: {
      width: '360px',
      height: '640px',
     },
     type: 'mobile',
    },
   },
  },
 },
 argTypes: {
  preview: {
   control: 'radio',
   options: ['full', 'small'],
  },
 },
 args: {
  preview: 'full',
 },
}

export default meta

export const Playground = {
 globals: {
  viewport: { value: 'desktopScreen', isRotated: false },
 },
 play: async ({ canvasElement }) => {
  initHeaderNavigation(canvasElement)
 },
}

export const SmallScreen = {
 args: {
  preview: 'small',
 },
 globals: {
  viewport: { value: 'smallScreen', isRotated: false },
 },
 play: async ({ canvasElement }) => {
  initHeaderNavigation(canvasElement)
 },
}