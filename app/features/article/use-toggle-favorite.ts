import { useMutation } from '@tanstack/vue-query'
import type { Article } from '~/shared/api/contracts/article'
import { articleApi } from '~/shared/api/rest/article'

export const useToggleFavorite = (
    article: Pick<Article, 'slug' | 'favorited'>
) => {
    const favoriteArticleMutation = useMutation({
        mutationKey: ['article', article.slug, 'favorite'],
        mutationFn: articleApi.favorite,
    })
    const unfavoriteArticleMutation = useMutation({
        mutationKey: ['article', article.slug, 'unfavorite'],
        mutationFn: articleApi.unfavorite,
    })

    async function toggle() {
        if (article.favorited) {
            unfavoriteArticleMutation.mutate({ slug: article.slug })
        } else {
            favoriteArticleMutation.mutate({ slug: article.slug })
        }
    }

    return { toggle }
}
