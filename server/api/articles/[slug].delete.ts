import { getRouterParam } from 'h3'
import { authService, articleService } from '../../services'

export default defineEventHandler(async event => {
    const currentUser = await authService.getCurrentUser(event)

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

    const article = await articleService.findArticleBySlug(slug)

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

    const deleted = await articleService.deleteArticle(slug)

    if (!deleted) {
        throw createError({
            statusCode: 404,
            message: 'Article not found',
        })
    }

    setResponseStatus(event, 204)
    return null
})
