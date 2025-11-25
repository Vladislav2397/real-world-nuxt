import { comments, getNextCommentId } from './store'
import type { Comment } from './types'

export const findCommentById = (id: number): Comment | undefined => {
    return comments.find(comment => comment.id === id)
}

export const getCommentsByArticleId = (articleId: number): Comment[] => {
    return comments
        .filter(comment => comment.articleId === articleId)
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
}

export const createComment = (data: {
    body: string
    articleId: number
    authorId: number
}): Comment => {
    const now = new Date().toISOString()

    const comment: Comment = {
        id: getNextCommentId(),
        body: data.body,
        createdAt: now,
        updatedAt: now,
        articleId: data.articleId,
        authorId: data.authorId,
    }

    comments.push(comment)
    return comment
}

export const deleteComment = (id: number): boolean => {
    const index = comments.findIndex(comment => comment.id === id)
    if (index === -1) return false

    comments.splice(index, 1)
    return true
}
