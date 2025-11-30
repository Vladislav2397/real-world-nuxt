// @vitest-environment nuxt
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useCreateArticle } from './use-create-article'
import { flushPromises } from '@vue/test-utils'
import { withNuxtSetup } from '~/shared/lib/test-utils/with-nuxt-setup'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

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

describe('useCreateArticle', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should initialize dto with empty values', async () => {
        const { dto } = await withNuxtSetup(() => useCreateArticle())

        expect(dto.value).toEqual({
            title: '',
            description: '',
            body: '',
            tagList: [],
        })
    })

    it('should create article with correct data', async () => {
        const mockResponse = {
            article: {
                slug: 'test-article',
                title: 'Test Article',
                description: 'Test Description',
                body: 'Test Body',
                tagList: ['test', 'article'],
            },
        }
        httpClientMock.mockResolvedValue(mockResponse)

        const { dto, create } = await withNuxtSetup(() => useCreateArticle())

        dto.value = {
            title: 'Test Article',
            description: 'Test Description',
            body: 'Test Body',
            tagList: ['test', 'article'],
        }

        const result = await create()
        await flushPromises()

        expect(httpClientMock).toHaveBeenCalledTimes(1)
        expect(httpClientMock).toHaveBeenCalledWith('/api/articles', {
            method: 'POST',
            body: {
                article: {
                    title: 'Test Article',
                    description: 'Test Description',
                    body: 'Test Body',
                    tagList: ['test', 'article'],
                },
            },
        })
        expect(result).toEqual(mockResponse)
    })

    it('should invalidate article list queries after successful creation', async () => {
        httpClientMock.mockResolvedValue({
            article: {
                slug: 'test-article',
                title: 'Test Article',
            },
        })

        const { create } = await withNuxtSetup(() => useCreateArticle())

        await create()
        await flushPromises()

        expect(queryClientMock.invalidateQueries).toHaveBeenCalledTimes(1)
    })
})
