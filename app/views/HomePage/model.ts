import { useQuery } from '@tanstack/vue-query'
import { useRouteQuery } from '@vueuse/router'
import {
    articleListQueryOptions,
    feedListQueryOptions,
} from '~/shared/api/query-options/article'

const LIMIT = 10

export const useArticleListModel = () => {
    const currentPage = useRouteQuery('page', '1')
    const currentTag = useRouteQuery('tag', '')
    const currentType = useRouteQuery<string>('type', 'global')

    const paginationParams = computed(() => ({
        limit: LIMIT,
        offset: (+currentPage.value - 1) * LIMIT,
    }))

    const articleParams = computed(() => ({
        ...paginationParams.value,
        ...(currentTag.value ? { tag: currentTag.value } : {}),
    }))

    const isArticleList = computed(() => currentType.value === 'global')
    const isFeedList = computed(() => currentType.value === 'feed')

    const articleListQuery = useQuery({
        ...articleListQueryOptions(articleParams),
        enabled: isArticleList,
    })
    const feedListQuery = useQuery({
        ...feedListQueryOptions(paginationParams),
        enabled: isFeedList,
    })

    const articles = computed(() => {
        if (currentType.value === 'global') {
            return articleListQuery.data.value?.articles ?? []
        }
        return feedListQuery.data.value?.articles ?? []
    })

    const articlesSuspense = () => {
        if (currentType.value === 'global') {
            return articleListQuery.suspense()
        }
        return feedListQuery.suspense()
    }

    const pages = computed(() => {
        const totalPages = Math.ceil(
            (articleListQuery.data.value?.articlesCount ?? 0) / LIMIT
        )

        return range(1, totalPages)
    })

    return {
        articles,
        articlesSuspense,
        pages,
        currentTag,
        currentType,
        currentPage,
    }
}

function range(start: number, end: number) {
    return Array.from({ length: end - (start - 1) }).map((_, i) => start + i)
}
