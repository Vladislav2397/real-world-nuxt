import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Article } from '~/shared/api/contracts/article'
import {
    articleBySlugQueryOptions,
    articleListQueryOptions,
} from '~/shared/api/query-options/article'
import { articleApi } from '~/shared/api/rest/article'

export const useToggleFavorite = (
    article: Pick<Article, 'slug' | 'favorited'>
) => {
    const queryClient = useQueryClient()

    const favoriteArticleMutation = useMutation({
        mutationKey: ['article', article.slug, 'favorite'],
        mutationFn: articleApi.favorite,
        onSuccess: async () => {
            await queryClient.invalidateQueries(articleListQueryOptions())
            await queryClient.invalidateQueries(
                articleBySlugQueryOptions({ slug: article.slug })
            )
        },
    })
    const unfavoriteArticleMutation = useMutation({
        mutationKey: ['article', article.slug, 'unfavorite'],
        mutationFn: articleApi.unfavorite,
        onSuccess: async () => {
            await queryClient.invalidateQueries(articleListQueryOptions())
            await queryClient.invalidateQueries(
                articleBySlugQueryOptions({ slug: article.slug })
            )
        },
    })

    async function toggle() {
        console.log('toggle', article.favorited)
        if (article.favorited) {
            console.log('unfavorite')
            await unfavoriteArticleMutation.mutateAsync({ slug: article.slug })
        } else {
            console.log('favorite')
            await favoriteArticleMutation.mutateAsync({ slug: article.slug })
        }
    }

    return { toggle }
}
