import { queryOptions } from '@tanstack/vue-query'
import {
    articleApi,
    type GetArticleBySlugParams,
    type GetArticleListParams,
    type GetCommentListParams,
    type GetFeedListParams,
} from '../rest/article'

export const articleListQueryOptions = (
    params?: MaybeRefOrGetter<GetArticleListParams>
) => {
    const httpClientPublic = useHttpClientPublic()

    const query = computed(() => toValue(params))

    return queryOptions({
        queryKey: ['article-list', params],
        queryFn: () =>
            httpClientPublic('/api/articles', { query: query.value }),
    })
}

export const articleBySlugQueryOptions = (
    params: MaybeRefOrGetter<GetArticleBySlugParams>
) => {
    const httpClientPublic = useHttpClientPublic()

    const slug = computed(() => toValue(params).slug)

    return queryOptions({
        queryKey: ['article', slug],
        queryFn: () =>
            httpClientPublic(
                `/api/articles/${slug.value}` as '/api/articles/:slug'
            ),
    })
}

export const articleFeedListQueryOptions = (
    params?: MaybeRefOrGetter<GetFeedListParams>
) => {
    const httpClient = useHttpClient()

    const query = computed(() => toValue(params))

    return queryOptions({
        queryKey: ['article-feed-list', params],
        queryFn: () => httpClient('/api/articles/feed', { query: query.value }),
    })
}

export const tagListQueryOptions = () => {
    const httpClientPublic = useHttpClientPublic()

    return queryOptions({
        queryKey: ['tag-list'],
        queryFn: () => httpClientPublic('/api/tags'),
    })
}

export const commentListQueryOptions = (
    params: MaybeRefOrGetter<GetCommentListParams>
) => {
    const httpClientPublic = useHttpClientPublic()

    const slug = computed(() => toValue(params).slug)

    return queryOptions({
        queryKey: ['comment-list', slug],
        queryFn: () => httpClientPublic(`/api/articles/${slug.value}/comments`),
    })
}
