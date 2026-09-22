export function initHeaderNavigation(root: ParentNode = document) {
	initMobileMenu(root)
	updateHeaderNavigationLinks(root)
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

function updateHeaderNavigationLinks(root: ParentNode) {
	const url = new URL(window.location.href)
	const category = url.searchParams.get('category')

	updateCategoryLinks(root, 'graphic-design', category, url)
	updateCategoryLinks(root, 'illustration', category, url)
}

function updateCategoryLinks(
	root: ParentNode,
	categoryName: string,
	currentCategory: string | null,
	currentUrl: URL,
) {
	const elements = root.querySelectorAll<HTMLAnchorElement>(
		`[data-nav-category="${categoryName}"]`,
	)

	elements.forEach((element) => {
		const targetUrl = new URL(currentUrl)
		const isActive = currentCategory === categoryName

		if (isActive) {
			targetUrl.searchParams.delete('category')
		} else {
			targetUrl.searchParams.set('category', categoryName)
		}

		element.href = targetUrl.pathname + targetUrl.search
		element.classList.toggle('active', isActive)
	})
}