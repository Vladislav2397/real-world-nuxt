// @vitest-environment nuxt
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useEditArticle } from './use-edit-article'
import { flushPromises } from '@vue/test-utils'
import { withNuxtSetup } from '~/shared/lib/test-utils/with-nuxt-setup'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { nextTick } from 'vue'

const { httpClientMock } = vi.hoisted(() => {
    const httpClientMock = vi.fn()
    return { httpClientMock }
})

mockNuxtImport('useHttpClient', () => {
    return () => httpClientMock
})

const { mockArticleData } = vi.hoisted(() => {
    const mockArticleData = {
        article: {
            slug: 'test-article',
            title: 'Original Title',
            description: 'Original Description',
            body: 'Original Body',
            tagList: ['original', 'tags'],
        },
    }
    return { mockArticleData }
})

vi.mock('@tanstack/vue-query', async () => {
    const actual = await vi.importActual('@tanstack/vue-query')
    return {
        ...actual,
        useQuery: ({ queryFn }: any) => {
            const data = ref(null)
            const suspense = async () => {
                data.value = await queryFn()
            }
            return {
                data,
                suspense,
            }
        },
        useMutation: ({ mutationFn }: any) => {
            return {
                mutateAsync: async () => {
                    return await mutationFn()
                },
            }
        },
    }
})

vi.mock('~/shared/api/rest/article', () => ({
    articleApi: {
        getBySlug: vi.fn().mockResolvedValue(mockArticleData),
    },
}))

describe('useEditArticle', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should initialize dto with empty values', async () => {
        const { dto } = await withNuxtSetup(() => useEditArticle('test-article'))

        expect(dto.value).toEqual({
            title: '',
            description: '',
            body: '',
            tagList: [],
        })
    })

    it('should load article data and populate dto', async () => {
        const { dto, articleSuspense } = await withNuxtSetup(() =>
            useEditArticle('test-article')
        )

        await articleSuspense()
        await nextTick()

        expect(dto.value).toEqual({
            title: 'Original Title',
            description: 'Original Description',
            body: 'Original Body',
            tagList: ['original', 'tags'],
        })
    })

    it('should update article with modified data', async () => {
        const mockResponse = {
            article: {
                slug: 'test-article',
                title: 'Updated Title',
                description: 'Updated Description',
                body: 'Updated Body',
                tagList: ['updated', 'tags'],
            },
        }
        httpClientMock.mockResolvedValue(mockResponse)

        const { dto, articleSuspense, handleSubmit } = await withNuxtSetup(() =>
            useEditArticle('test-article')
        )

        await articleSuspense()
        await nextTick()

        dto.value = {
            title: 'Updated Title',
            description: 'Updated Description',
            body: 'Updated Body',
            tagList: ['updated', 'tags'],
        }

        await handleSubmit()
        await flushPromises()

        expect(httpClientMock).toHaveBeenCalledTimes(1)
        expect(httpClientMock).toHaveBeenCalledWith('/api/articles/test-article', {
            method: 'PUT',
            body: {
                article: {
                    title: 'Updated Title',
                    description: 'Updated Description',
                    body: 'Updated Body',
                    tagList: ['updated', 'tags'],
                },
            },
        })
    })

    it('should handle article data updates reactively', async () => {
        const { dto, articleSuspense } = await withNuxtSetup(() =>
            useEditArticle('test-article')
        )

        expect(dto.value.title).toBe('')

        await articleSuspense()
        await nextTick()

        expect(dto.value.title).toBe('Original Title')
        expect(dto.value.description).toBe('Original Description')
        expect(dto.value.body).toBe('Original Body')
        expect(dto.value.tagList).toEqual(['original', 'tags'])
    })
})

