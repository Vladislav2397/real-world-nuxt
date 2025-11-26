import { getRouterParam } from 'h3'
import { findArticleBySlug } from '../../utils/articles'
import { transformArticle } from '../../utils/transform'
import { getCurrentUser } from '../../utils/auth'

export default defineEventHandler(event => {
    const slug = getRouterParam(event, 'slug')
    const currentUser = getCurrentUser(event)

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

    return {
        article: transformArticle(article, currentUser?.id),
    }
})
