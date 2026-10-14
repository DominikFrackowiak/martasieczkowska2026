

import { expect, test } from 'vitest'
import { cn } from '../lib/cn'

test('joins class names', () => {
  expect(cn('test', 'test2')).toBe('test test2')
})

test('ignores falsy values', () => {
  expect(cn('base', false && 'hidden', null, undefined)).toBe('base')
})

test('merges conflicting tailwind classes', () => {
  expect(cn('p-2', 'p-4')).toBe('p-4')
})