import { httpClient } from '../http-client'

export type GetArticleListParams = {
    tag?: string
    author?: string
    favorited?: string
    limit?: number
    offset?: number
}
const getArticleListRequest = async (params?: GetArticleListParams) => {
    const response = await $fetch('/api/articles', { query: params })

    return response
}

export type GetArticleBySlugParams = { slug: string }
const getArticleBySlugRequest = async (params: GetArticleBySlugParams) => {
    const response = await httpClient.get(`/api/articles/${params.slug}`)

    return response.data
}

const getCommentListRequest = async (params: { slug: string }) => {
    const response = await httpClient.get(
        `/api/articles/${params.slug}/comments`
    )

    return response.data
}

const createCommentRequest = async (params: { slug: string; body: string }) => {
    const response = await httpClient.post(
        `/api/articles/${params.slug}/comments`,
        {
            comment: {
                body: params.body,
            },
        }
    )

    return response.data
}

const deleteCommentRequest = async (params: { slug: string; id: number }) => {
    await httpClient.delete(
        `/api/articles/${params.slug}/comments/${params.id}`
    )
}

const createArticleRequest = async (data: {
    title: string
    description: string
    body: string
    tagList: string[]
}) => {
    const response = await httpClient.post('/api/articles', {
        article: data,
    })

    return response.data
}

const editArticleRequest = async (params: {
    slug: string
    title?: string
    description?: string
    body?: string
    tagList?: string[]
}) => {
    const { slug, ...articleData } = params
    const response = await httpClient.put(`/api/articles/${slug}`, {
        article: articleData,
    })

    return response.data
}

const deleteArticleRequest = async (params: { slug: string }) => {
    await httpClient.delete(`/api/articles/${params.slug}`)
}

const favoriteArticleRequest = async (params: { slug: string }) => {
    const response = await httpClient.post(
        `/api/articles/${params.slug}/favorite`
    )

    return response.data
}

const unfavoriteArticleRequest = async (params: { slug: string }) => {
    const response = await httpClient.delete(
        `/api/articles/${params.slug}/favorite`
    )

    return response.data
}

export type GetFeedListParams = { limit?: number; offset?: number }
const getFeedListRequest = async (params?: GetFeedListParams) => {
    const response = await httpClient.get('/api/articles/feed', { params })

    return response.data
}

const getTagListRequest = async () => {
    const response = await httpClient.get('/api/tags')

    return response.data
}

export const articleApi = {
    getList: getArticleListRequest,
    getBySlug: getArticleBySlugRequest,
    getFeedList: getFeedListRequest,
    create: createArticleRequest,
    edit: editArticleRequest,
    delete: deleteArticleRequest,
    favorite: favoriteArticleRequest,
    unfavorite: unfavoriteArticleRequest,
    getComments: getCommentListRequest,
    createComment: createCommentRequest,
    deleteComment: deleteCommentRequest,
    getTagList: getTagListRequest,
}
