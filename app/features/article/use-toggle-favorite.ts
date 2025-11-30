import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Article } from '~/shared/api/contracts/article'
import {
    articleBySlugQueryOptions,
    articleListQueryOptions,
} from '~/shared/api/query-options/article'

export const useToggleFavorite = (
    article: Ref<Pick<Article, 'slug' | 'favorited'>>
) => {
    const queryClient = useQueryClient()

    const isFavorite = computed(() => article.value.favorited)
    const slug = computed(() => article.value.slug)

    const httpClient = useHttpClient()

    const favoriteArticleMutation = useMutation({
        mutationKey: ['article', slug, 'favorite'],
        mutationFn: () =>
            httpClient(`/api/articles/${slug.value}/favorite`, {
                method: 'POST',
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries(articleListQueryOptions())
            await queryClient.invalidateQueries(
                articleBySlugQueryOptions({ slug: slug.value })
            )
        },
    })
    const unfavoriteArticleMutation = useMutation({
        mutationKey: ['article', slug, 'unfavorite'],
        mutationFn: () =>
            httpClient(`/api/articles/${slug.value}/favorite`, {
                method: 'DELETE',
            }),
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
            await unfavoriteArticleMutation.mutateAsync()
        } else {
            console.log('favorite')
            await favoriteArticleMutation.mutateAsync()
        }
    }

    return { toggle }
}
