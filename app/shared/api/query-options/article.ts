import { queryOptions } from '@tanstack/vue-query'
import {
    articleApi,
    type GetArticleBySlugParams,
    type GetArticleListParams,
} from '../rest/article'

export const articleListQueryOptions = (params?: GetArticleListParams) => {
    return queryOptions({
        queryKey: ['article-list', params],
        queryFn: () => articleApi.getList(params),
    })
}

export const articleBySlugQueryOptions = (
    params: MaybeRefOrGetter<GetArticleBySlugParams>
) => {
    return queryOptions({
        queryKey: ['article', params],
        queryFn: () => articleApi.getBySlug(toValue(params)),
    })
}
