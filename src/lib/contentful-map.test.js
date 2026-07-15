import { describe, it, expect } from 'vitest'
import { mapArticleToFrontmatter } from './contentful-map.js'

it('maps core fields and preserves body', () => {
  const article = {
    id: '123', title: 'Hello', subtitle: 'Sub', synopsis: 'Syn',
    slug: 'hello', oldSlugs: ['hi'], isDraft: false,
    body: '# Body', legacyPublishedAt: '2020-01-01T00:00:00Z',
  }
  const { frontmatter, body, slug } = mapArticleToFrontmatter(article)
  expect(slug).toBe('hello')
  expect(frontmatter.title).toBe('Hello')
  expect(frontmatter.oldSlugs).toEqual(['hi'])
  expect(frontmatter.draft).toBe(false)
  expect(body).toBe('# Body')
})
