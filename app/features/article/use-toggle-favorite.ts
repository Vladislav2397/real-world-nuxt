import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Article } from '~/shared/api/contracts/article'
import {
    articleBySlugQueryOptions,
    articleListQueryOptions,
} from '~/shared/api/query-options/article'
import { articleApi } from '~/shared/api/rest/article'

export const useToggleFavorite = (
    article: Ref<Pick<Article, 'slug' | 'favorited'>>
) => {
    const queryClient = useQueryClient()

    const isFavorite = computed(() => article.value.favorited)
    const slug = computed(() => article.value.slug)

    const favoriteArticleMutation = useMutation({
        mutationKey: ['article', slug, 'favorite'],
        mutationFn: articleApi.favorite,
        onSuccess: async () => {
            await queryClient.invalidateQueries(articleListQueryOptions())
            await queryClient.invalidateQueries(
                articleBySlugQueryOptions({ slug: slug.value })
            )
        },
    })
    const unfavoriteArticleMutation = useMutation({
        mutationKey: ['article', slug, 'unfavorite'],
        mutationFn: articleApi.unfavorite,
        onSuccess: async () => {
            await queryClient.invalidateQueries(articleListQueryOptions())
            await queryClient.invalidateQueries(
                articleBySlugQueryOptions({ slug: slug.value })
            )
        },
    })

    async function toggle() {
        console.log('toggle', isFavorite.value)
        if (isFavorite.value) {
            console.log('unfavorite')
            await unfavoriteArticleMutation.mutateAsync({
                slug: slug.value,
            })
        } else {
            console.log('favorite')
            await favoriteArticleMutation.mutateAsync({
                slug: slug.value,
            })
        }
    }

    return { toggle }
}
