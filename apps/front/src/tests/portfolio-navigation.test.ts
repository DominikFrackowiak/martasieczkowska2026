import { describe, expect, it } from 'vitest'
import { categoryURL, getCategory, getPortfolioNavigation, portfolioURL } from '../lib/portfolio-navigation'

const entries = [
  { slug: 'first', category: 'illustration' },
  { slug: 'second', category: 'graphic-design' },
  { slug: 'third', category: 'illustration' },
]

describe('Portfolio navigation', () => {
  it('opens the filtered index when choosing another category on a project', () => {
    expect(categoryURL('/works/second', entries[1], null, 'illustration')).toBe('/?category=illustration')
    expect(categoryURL('/works/second', entries[1], 'graphic-design', 'illustration')).toBe('/?category=illustration')
    expect(categoryURL('/works/first', entries[0], null, 'graphic-design')).toBe('/?category=graphic-design')
  })

  it('toggles the current project category and keeps listing and About filters on their page', () => {
    expect(categoryURL('/works/second', entries[1], null, 'graphic-design')).toBe('/works/second?category=graphic-design')
    expect(categoryURL('/works/second', entries[1], 'graphic-design', 'graphic-design')).toBe('/works/second')
    expect(categoryURL('/', undefined, null, 'illustration')).toBe('/?category=illustration')
    expect(categoryURL('/about', undefined, 'graphic-design', 'illustration')).toBe('/about?category=illustration')
  })

  it('preserves CMS order and finds neighbours in the selected category', () => {
    const state = getPortfolioNavigation(entries, 'first', 'illustration')
    expect(state.visible.map(entry => entry.slug)).toEqual(['first', 'third'])
    expect(state.previous).toBeUndefined()
    expect(state.next).toBe('third')
    expect(getPortfolioNavigation(entries, 'third', 'illustration').next).toBeUndefined()
    expect(getPortfolioNavigation(entries, 'second', null)).toMatchObject({ previous: 'first', next: 'third' })
  })

  it('clears a category that does not match the current project', () => {
    expect(getPortfolioNavigation(entries, 'second', 'illustration'))
      .toMatchObject({ category: null, visible: entries, previous: 'first', next: 'third' })
  })

  it('handles listings, empty collections and single-project categories', () => {
    expect(getPortfolioNavigation(entries, undefined, 'illustration').visible).toHaveLength(2)
    expect(getPortfolioNavigation([], undefined, null)).toMatchObject({ visible: [], previous: undefined, next: undefined })
    expect(getPortfolioNavigation(entries, 'second', 'graphic-design')).toMatchObject({ previous: undefined, next: undefined })
  })

  it('validates URL categories and preserves the filter in project and index links', () => {
    expect(getCategory('unknown')).toBeNull()
    expect(getCategory(null)).toBeNull()
    expect(getCategory('illustration')).toBe('illustration')
    expect(portfolioURL('/works/first', 'illustration')).toBe('/works/first?category=illustration')
    expect(portfolioURL('/', 'graphic-design')).toBe('/?category=graphic-design')
    expect(portfolioURL('/', null)).toBe('/')
  })
})
