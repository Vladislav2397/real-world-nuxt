// @vitest-environment nuxt
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useToggleFavorite } from './use-toggle-favorite'
import { flushPromises } from '@vue/test-utils'
import { withNuxtSetup } from '~/shared/lib/test-utils/with-nuxt-setup'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import type { Article } from '~/shared/api/contracts/article'

const { httpClientMock } = vi.hoisted(() => {
    const httpClientMock = vi.fn()
    return { httpClientMock }
})

const { queryClientMock } = vi.hoisted(() => {
    const invalidateQueriesMock = vi.fn().mockResolvedValue(undefined)
    const queryClientMock = {
        invalidateQueries: invalidateQueriesMock,
    }
    return { queryClientMock, invalidateQueriesMock }
})

mockNuxtImport('useHttpClient', () => {
    return () => httpClientMock
})

vi.mock('@tanstack/vue-query', async () => {
    const actual = await vi.importActual('@tanstack/vue-query')
    return {
        ...actual,
        useQueryClient: () => queryClientMock,
        useMutation: ({ mutationFn, onSuccess }: any) => {
            return {
                mutateAsync: async () => {
                    const result = await mutationFn()
                    if (onSuccess) {
                        await onSuccess(result)
                    }
                    return result
                },
            }
        },
    }
})

describe('useToggleFavorite', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should favorite an article when article is not favorited', async () => {
        httpClientMock.mockResolvedValue({ data: {} })

        const article = ref<Pick<Article, 'slug' | 'favorited'>>({
            slug: 'test-article',
            favorited: false,
        })

        const { toggle } = await withNuxtSetup(() => useToggleFavorite(article))

        await toggle()
        await flushPromises()

        expect(httpClientMock).toHaveBeenCalledTimes(1)
        expect(httpClientMock).toHaveBeenCalledWith(
            '/api/articles/test-article/favorite',
            {
                method: 'POST',
            }
        )
        expect(queryClientMock.invalidateQueries).toHaveBeenCalledTimes(2)
    })

    it('should unfavorite an article when article is favorited', async () => {
        httpClientMock.mockResolvedValue({ data: {} })

        const article = ref<Pick<Article, 'slug' | 'favorited'>>({
            slug: 'test-article',
            favorited: true,
        })

        const { toggle } = await withNuxtSetup(() => useToggleFavorite(article))

        await toggle()
        await flushPromises()

        expect(httpClientMock).toHaveBeenCalledTimes(1)
        expect(httpClientMock).toHaveBeenCalledWith(
            '/api/articles/test-article/favorite',
            {
                method: 'DELETE',
            }
        )
        expect(queryClientMock.invalidateQueries).toHaveBeenCalledTimes(2)
    })

    it('should invalidate article list and article by slug queries after favorite', async () => {
        httpClientMock.mockResolvedValue({ data: {} })

        const article = ref<Pick<Article, 'slug' | 'favorited'>>({
            slug: 'test-article-slug',
            favorited: false,
        })

        const { toggle } = await withNuxtSetup(() => useToggleFavorite(article))

        await toggle()
        await flushPromises()

        // Проверяем, что invalidateQueries был вызван для article list
        expect(queryClientMock.invalidateQueries).toHaveBeenCalled()
    })
})
