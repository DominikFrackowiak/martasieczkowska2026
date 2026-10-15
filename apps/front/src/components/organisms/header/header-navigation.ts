import { updatePortfolio } from '../../../lib/portfolio-navigation'

export function initHeaderNavigation(root: ParentNode = document) {
	initMobileMenu(root)
	updatePortfolio(root)
}

function initMobileMenu(root: ParentNode) {
	const headers = root.querySelectorAll<HTMLElement>('[data-header]')

	headers.forEach((header) => {
		if (header.dataset.headerNavigationInitialized === 'true') {
			return
		}

		const button = header.querySelector<HTMLButtonElement>('[data-menu-button]')
		const navigation = header.querySelector<HTMLElement>(
			'[data-mobile-navigation]',
		)

		if (!button || !navigation) {
			return
		}

		header.dataset.headerNavigationInitialized = 'true'

		button.addEventListener('click', () => {
			const shouldOpen = button.getAttribute('aria-expanded') !== 'true'

			button.setAttribute('aria-expanded', String(shouldOpen))

			navigation.classList.toggle('max-h-0', !shouldOpen)
			navigation.classList.toggle('max-h-64', shouldOpen)
			navigation.classList.toggle('opacity-0', !shouldOpen)
			navigation.classList.toggle('opacity-100', shouldOpen)
			navigation.classList.toggle('pointer-events-none', !shouldOpen)
		})
	})
}
