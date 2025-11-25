import { getRouterParam } from 'h3'
import { findArticleBySlug } from '../../../utils/articles'
import { getCommentsByArticleId } from '../../../utils/comments'
import { transformComment } from '../../../utils/transform'
import { getCurrentUser } from '../../../utils/auth'

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

    const comments = getCommentsByArticleId(article.id)

    return {
        comments: comments.map(comment =>
            transformComment(comment, currentUser?.id)
        ),
    }
})
