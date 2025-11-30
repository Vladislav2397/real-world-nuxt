import { queryOptions } from '@tanstack/vue-query'
import type {
    GetArticleBySlugParams,
    GetArticleListParams,
    GetCommentListParams,
    GetFeedListParams,
} from '../rest/article'

export const articleListQueryOptions = (
    params?: MaybeRefOrGetter<GetArticleListParams>
) => {
    const httpClient = useHttpClient()

    const query = computed(() => toValue(params))

    return queryOptions({
        queryKey: query.value ? ['article-list', query] : ['article-list'],
        queryFn: () => {
            return httpClient('/api/articles', { query: query.value })
        },
    })
}

export const feedListQueryOptions = (
    params?: MaybeRefOrGetter<GetFeedListParams>
) => {
    const httpClient = useHttpClient()
    const query = computed(() => toValue(params))

    return queryOptions({
        queryKey: ['feed-list', query],
        queryFn: () => {
            return httpClient('/api/articles/feed', {
                query: query.value,
            })
        },
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
