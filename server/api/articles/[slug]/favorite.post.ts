import { getRouterParam } from 'h3'
import { getCurrentUser } from '../../../utils/auth'
import { findArticleBySlug, addFavorite } from '../../../utils/articles'
import { transformArticle } from '../../../utils/transform'

export default defineEventHandler(event => {
    const currentUser = getCurrentUser(event)

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

    const article = findArticleBySlug(slug)

    if (!article) {
        throw createError({
            statusCode: 404,
            message: 'Article not found',
        })
    }

    addFavorite(article.id, currentUser.id)

    return {
        article: transformArticle(article, currentUser.id),
    }
})
