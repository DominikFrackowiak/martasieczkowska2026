// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createWorkSlug, getWorkTitle, Works } from '../../src/collections/Works'

describe('Works collection', () => {
  it('derives a readable title from ordered title lines', () => {
    expect(getWorkTitle([{ text: ' Farm animals ' }, { text: 'illustrations' }]))
      .toBe('Farm animals illustrations')
  })

  it('creates URL-safe slugs, including titles with Polish characters', () => {
    expect(createWorkSlug('Farm animals')).toBe('farm-animals')
    expect(createWorkSlug('Łąka i żółw!')).toBe('laka-i-zolw')
  })

  it('generates identity before validation and preserves an existing URL', async () => {
    const hook = Works.hooks?.beforeValidate?.[0]
    expect(hook).toBeTypeOf('function')

    const created = await hook!({
      data: { description: { titleLines: [{ text: 'Farm animals' }] } },
      operation: 'create',
    } as never)
    expect(created).toMatchObject({ title: 'Farm animals', slug: 'farm-animals' })

    const updated = await hook!({
      data: { description: { titleLines: [{ text: 'Forest animals' }] } },
      operation: 'update',
      originalDoc: { slug: 'farm-animals' },
    } as never)
    expect(updated).toMatchObject({ title: 'Forest animals', slug: 'farm-animals' })
  })

  it('hides generated identity fields from the edit form', () => {
    const fields = Works.fields.filter(field => 'name' in field)
    for (const name of ['title', 'slug']) {
      const field = fields.find(field => field.name === name)
      const admin = field && 'admin' in field ? field.admin as { hidden?: boolean } | undefined : undefined
      expect(admin?.hidden).toBe(true)
    }
  })
})
