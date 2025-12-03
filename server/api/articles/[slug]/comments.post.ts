import { getRouterParam } from 'h3'
import { authService, articleService, commentService } from '../../../services'
import { transformComment } from '../../../utils/transform'

export default defineEventHandler(async event => {
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

    const body = await readBody(event)

    if (!body?.comment?.body) {
        throw createError({
            statusCode: 422,
            message: 'Comment body is required',
        })
    }

    const comment = commentService.createComment({
        body: body.comment.body,
        articleId: article.id,
        authorId: currentUser.id,
    })

    return {
        comment: transformComment(comment, currentUser.id),
    }
})
