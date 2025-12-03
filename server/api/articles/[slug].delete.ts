import { getRouterParam } from 'h3'
import { authService, articleService } from '../../services'

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

    if (article.authorId !== currentUser.id) {
        throw createError({
            statusCode: 403,
            message: 'Forbidden',
        })
    }

    const deleted = articleService.deleteArticle(slug)

    if (!deleted) {
        throw createError({
            statusCode: 404,
            message: 'Article not found',
        })
    }

    setResponseStatus(event, 204)
    return null
})
