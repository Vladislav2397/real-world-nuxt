// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Article from './Article.vue'
import type { Article as ArticleType } from '~/shared/api/contracts/article'

describe('Article component', () => {
    it('renders the article', async () => {
        const article: ArticleType = {
            slug: 'how-to-train-your-dragon',
            title: 'How to train your dragon',
            description: 'Ever wonder how?',
            tagList: ['dragons', 'training'],
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            favorited: false,
            favoritesCount: 0,
            author: {
                username: 'jake',
                bio: 'I work at statefarm',
                image: 'https://i.stack.imgur.com/xHWG8.jpg',
                following: false,
            },
        }
        const component = await mountSuspended(Article, {
            props: { article },
        })

        expect(component.text()).toContain('How to train your dragon')
        expect(component.text()).toContain('dragons')
        expect(component.text()).toContain('training')
    })
})
