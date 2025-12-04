import { getRouterParam } from 'h3'
import { articleService, commentService, authService } from '../../../services'
import { transformComment } from '../../../utils/transform'

export default defineEventHandler(async event => {
    const slug = getRouterParam(event, 'slug')
    const currentUser = await authService.getCurrentUser(event)

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

    const comments = await commentService.getCommentsByArticleId(article.id)

    return {
        comments: await Promise.all(
            comments.map(comment =>
                transformComment(comment, currentUser?.id)
            )
        ),
    }
})
