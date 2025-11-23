import { useMutation } from '@tanstack/vue-query'
import type { Article } from '~/shared/api/contracts/article'
import { articleApi } from '~/shared/api/rest/article'

export const useToggleFavorite = (
    article: Pick<Article, 'slug' | 'favorited'> | null
) => {
    const { mutateAsync: favoriteArticle } = useMutation({
        mutationKey: ['favorite-article'],
        mutationFn: articleApi.favorite,
    })
    const { mutateAsync: unfavoriteArticle } = useMutation({
        mutationKey: ['unfavorite-article'],
        mutationFn: articleApi.unfavorite,
    })

    const toggle = async () => {
        if (!article) return

        if (article.favorited) {
            await unfavoriteArticle({ slug: article.slug })
        } else {
            await favoriteArticle({ slug: article.slug })
        }
    }

    return { toggle }
}
