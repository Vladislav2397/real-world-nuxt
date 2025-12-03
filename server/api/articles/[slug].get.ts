import { getRouterParam } from 'h3'
import { authService, articleService } from '../../services'
import { transformArticle } from '../../utils/transform'

export default defineEventHandler(event => {
    const slug = getRouterParam(event, 'slug')
    const currentUser = authService.getCurrentUser(event)

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

    return {
        article: transformArticle(article, currentUser?.id),
    }
})
