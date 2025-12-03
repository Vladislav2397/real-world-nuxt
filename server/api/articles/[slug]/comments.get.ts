import { getRouterParam } from 'h3'
import { articleService, commentService, authService } from '../../../services'
import { transformComment } from '../../../utils/transform'

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

    const comments = commentService.getCommentsByArticleId(article.id)

    return {
        comments: comments.map(comment =>
            transformComment(comment, currentUser?.id)
        ),
    }
})
