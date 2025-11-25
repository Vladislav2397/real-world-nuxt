import { getRouterParam } from 'h3'
import { getCurrentUser } from '../../../../utils/auth'
import { findCommentById, deleteComment } from '../../../../utils/comments'

export default defineEventHandler(event => {
    const currentUser = getCurrentUser(event)

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

    const comment = findCommentById(commentId)

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

    const deleted = deleteComment(commentId)

    if (!deleted) {
        throw createError({
            statusCode: 404,
            message: 'Comment not found',
        })
    }

    setResponseStatus(event, 204)
    return null
})
