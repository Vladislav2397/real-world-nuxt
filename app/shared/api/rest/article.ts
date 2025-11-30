export type GetArticleListParams = {
    tag?: string
    author?: string
    favorited?: string
    limit?: number
    offset?: number
}
const getArticleListRequest = async (params?: GetArticleListParams) => {
    const httpClient = useHttpClient()
    const response = await httpClient('/api/articles', {
        query: params,
    })

    return response
}

export type GetArticleBySlugParams = { slug: string }
const getArticleBySlugRequest = async (params: GetArticleBySlugParams) => {
    const httpClient = useHttpClient()
    const response = await httpClient(
        `/api/articles/${params.slug}` as '/api/articles/:slug'
    )

    return response
}

export type GetCommentListParams = { slug: string }
const getCommentListRequest = async (params: GetCommentListParams) => {
    const httpClient = useHttpClient()
    const response = await httpClient(`/api/articles/${params.slug}/comments`)

    return response
}

const createCommentRequest = async (params: { slug: string; body: string }) => {
    const httpClient = useHttpClient()
    const response = await httpClient(`/api/articles/${params.slug}/comments`, {
        method: 'POST',
        body: {
            comment: {
                body: params.body,
            },
        },
    })

    return response
}

const deleteCommentRequest = async (params: { slug: string; id: number }) => {
    const httpClient = useHttpClient()
    await httpClient(`/api/articles/${params.slug}/comments/${params.id}`, {
        method: 'DELETE',
    })
}

const createArticleRequest = async (data: {
    title: string
    description: string
    body: string
    tagList: string[]
}) => {
    const httpClient = useHttpClient()
    const response = await httpClient('/api/articles', {
        method: 'POST',
        body: {
            article: data,
        },
    })

    return response
}

const editArticleRequest = async (params: {
    slug: string
    title?: string
    description?: string
    body?: string
    tagList?: string[]
}) => {
    const { slug, ...articleData } = params
    const httpClient = useHttpClient()
    const response = await (httpClient as any)(`/api/articles/${slug}`, {
        method: 'PUT',
        body: {
            article: articleData,
        },
    })

    return response
}

const deleteArticleRequest = async (params: { slug: string }) => {
    const httpClient = useHttpClient()
    await (httpClient as any)(`/api/articles/${params.slug}`, {
        method: 'DELETE',
    })
}

const favoriteArticleRequest = async (params: { slug: string }) => {
    const httpClient = useHttpClient()
    const response = await httpClient(`/api/articles/${params.slug}/favorite`, {
        method: 'POST',
    })

    return response
}

const unfavoriteArticleRequest = async (params: { slug: string }) => {
    const httpClient = useHttpClient()
    const response = await httpClient(`/api/articles/${params.slug}/favorite`, {
        method: 'DELETE',
    })

    return response
}

export type GetFeedListParams = { limit?: number; offset?: number }
const getFeedListRequest = async (params?: GetFeedListParams) => {
    const httpClient = useHttpClient()
    const response = await httpClient('/api/articles/feed', {
        query: params,
    })

    return response
}

const getTagListRequest = async () => {
    const httpClient = useHttpClient()
    const response = await httpClient('/api/tags')

    return response
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
