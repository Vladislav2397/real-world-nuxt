import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Article } from '~/shared/api/contracts/article'
import {
    articleBySlugQueryOptions,
    articleListQueryOptions,
} from '~/shared/api/query-options/article'
import { articleApi } from '~/shared/api/rest/article'

export const useToggleFavorite = (
    article: Ref<Pick<Article, 'slug' | 'favorited'>>,
) => {
    const queryClient = useQueryClient()

    const isFavorite = computed(() => article.value.favorited)

    const favoriteArticleMutation = useMutation({
        mutationKey: ['article', article.value.slug, 'favorite'],
        mutationFn: articleApi.favorite,
        onSuccess: async () => {
            await queryClient.invalidateQueries(articleListQueryOptions())
            await queryClient.invalidateQueries(
                articleBySlugQueryOptions({ slug: article.value.slug }),
            )
        },
    })
    const unfavoriteArticleMutation = useMutation({
        mutationKey: ['article', article.value.slug, 'unfavorite'],
        mutationFn: articleApi.unfavorite,
        onSuccess: async () => {
            await queryClient.invalidateQueries(articleListQueryOptions())
            await queryClient.invalidateQueries(
                articleBySlugQueryOptions({ slug: article.value.slug }),
            )
        },
    })

    async function toggle() {
        console.log('toggle', isFavorite.value)
        if (isFavorite.value) {
            console.log('unfavorite')
            await unfavoriteArticleMutation.mutateAsync({
                slug: article.value.slug,
            })
        } else {
            console.log('favorite')
            await favoriteArticleMutation.mutateAsync({
                slug: article.value.slug,
            })
        }
    }

    return { toggle }
}
