export type Category = 'graphic-design' | 'illustration'
export type PortfolioEntry = { slug: string; category: string }

export function getCategory(value: string | null): Category | null {
  return value === 'graphic-design' || value === 'illustration' ? value : null
}

export function getPortfolioNavigation(entries: PortfolioEntry[], slug: string | undefined, category: Category | null) {
  const current = entries.find(entry => entry.slug === slug)
  const activeCategory = current && category && current.category !== category ? null : category
  const visible = entries.filter(entry => !activeCategory || entry.category === activeCategory)
  const index = visible.findIndex(entry => entry.slug === slug)
  return {
    category: activeCategory,
    visible,
    previous: index > 0 ? visible[index - 1].slug : undefined,
    next: index >= 0 ? visible[index + 1]?.slug : undefined,
  }
}

export function portfolioURL(pathname: string, category: Category | null) {
  const query = new URLSearchParams()
  if (category) query.set('category', category)
  return pathname + (query.size ? `?${query}` : '')
}

export function categoryURL(pathname: string, currentProject: PortfolioEntry | undefined, activeCategory: Category | null, selectedCategory: Category | null) {
  const category = selectedCategory === activeCategory ? null : selectedCategory
  const destination = currentProject && category && currentProject.category !== category ? '/' : pathname
  return portfolioURL(destination, category)
}

export function updatePortfolio(root: ParentNode = document, url = new URL(window.location.href), normalizeURL = true) {
  const thumbnails = [...root.querySelectorAll<HTMLAnchorElement>('[data-work-slug]')]
  const entries = thumbnails.map(link => ({ slug: link.dataset.workSlug!, category: link.dataset.workCategory! }))
  const slug = url.pathname.match(/^\/works\/([^/]+)\/?$/)?.[1]
  const currentProject = entries.find(entry => entry.slug === slug)
  const state = getPortfolioNavigation(entries, slug, getCategory(url.searchParams.get('category')))
  if (normalizeURL && url.searchParams.has('category') && url.searchParams.get('category') !== state.category) {
    url.searchParams.delete('category')
    window.history.replaceState(window.history.state, '', url)
  }
  thumbnails.forEach(link => {
    link.hidden = Boolean(state.category && link.dataset.workCategory !== state.category)
    link.href = portfolioURL(`/works/${link.dataset.workSlug}`, state.category)
  })
  root.querySelectorAll<HTMLElement>('[data-portfolio-empty]').forEach(element => {
    element.hidden = state.visible.length > 0
  })
  root.querySelectorAll<HTMLAnchorElement>('[data-nav-category]').forEach(link => {
    const category = getCategory(link.dataset.navCategory ?? null)
    const active = category === state.category
    link.href = categoryURL(url.pathname, currentProject, state.category, category)
    link.classList.toggle('active', active)
    if (active) link.setAttribute('aria-current', 'true')
    else link.removeAttribute('aria-current')
  })
  for (const direction of ['previous', 'next'] as const) {
    root.querySelectorAll<HTMLAnchorElement>(`[data-project-${direction}]`).forEach(link => {
      const target = state[direction]
      link.hidden = !target
      if (target) link.href = portfolioURL(`/works/${target}`, state.category)
    })
  }
  root.querySelectorAll<HTMLAnchorElement>('[data-project-index]').forEach(link => {
    link.href = portfolioURL('/', state.category)
  })
}
