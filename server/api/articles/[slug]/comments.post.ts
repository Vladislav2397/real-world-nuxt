import { getRouterParam } from 'h3'
import { getCurrentUser } from '../../../utils/auth'
import { findArticleBySlug } from '../../../utils/articles'
import { createComment } from '../../../utils/comments'
import { transformComment } from '../../../utils/transform'

export default defineEventHandler(async event => {
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

    const body = await readBody(event)

    if (!body?.comment?.body) {
        throw createError({
            statusCode: 422,
            message: 'Comment body is required',
        })
    }

    const comment = createComment({
        body: body.comment.body,
        articleId: article.id,
        authorId: currentUser.id,
    })

    return {
        comment: transformComment(comment, currentUser.id),
    }
})
