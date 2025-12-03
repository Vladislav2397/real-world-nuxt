import { getRouterParam } from 'h3'
import { authService, commentService } from '../../../../services'

export default defineEventHandler(event => {
    const currentUser = authService.getCurrentUser(event)

    if (!currentUser) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Comment ID is required',
        })
    }

    const commentId = Number(id)

    if (isNaN(commentId)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid comment ID',
        })
    }

    const comment = commentService.findCommentById(commentId)

    if (!comment) {
        throw createError({
            statusCode: 404,
            message: 'Comment not found',
        })
    }

    if (comment.authorId !== currentUser.id) {
        throw createError({
            statusCode: 403,
            message: 'Forbidden',
        })
    }

    const deleted = commentService.deleteComment(commentId)

    if (!deleted) {
        throw createError({
            statusCode: 404,
            message: 'Comment not found',
        })
    }

    setResponseStatus(event, 204)
    return null
})
