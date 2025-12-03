import { getRouterParam } from 'h3'
import { authService, articleService } from '../../../services'
import { transformArticle } from '../../../utils/transform'

export default defineEventHandler(event => {
    const currentUser = authService.getCurrentUser(event)

    if (!currentUser) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const slug = getRouterParam(event, 'slug')

    if (!slug) {
        throw createError({
            statusCode: 400,
            message: 'Slug is required',
        })
    }

    const article = articleService.findArticleBySlug(slug)

    if (!article) {
        throw createError({
            statusCode: 404,
            message: 'Article not found',
        })
    }

    const isSuccess = articleService.removeFavorite(article.id, currentUser.id)

    if (!isSuccess) {
        throw createError({
            statusCode: 400,
            message: 'Article not favorited',
        })
    }

    return {
        article: transformArticle(article, currentUser.id),
    }
})
