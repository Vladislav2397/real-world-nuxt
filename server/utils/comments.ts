import { db } from './db'
import type { Comment } from './types'

export const findCommentById = (id: number): Comment | undefined => {
    return db.comment.findById(id)
}

export const getCommentsByArticleId = (articleId: number): Comment[] => {
    return db.comment.getByArticleId(articleId)
}

export const createComment = (data: {
    body: string
    articleId: number
    authorId: number
}): Comment => {
    return db.comment.create(data)
}

export const deleteComment = (id: number): boolean => {
    return db.comment.delete(id)
}
