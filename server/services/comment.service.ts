import { db } from '../utils/db'
import type { Comment } from '../utils/types'

export class CommentService {
    findCommentById(id: number): Comment | undefined {
        return db.comment.findById(id)
    }

    getCommentsByArticleId(articleId: number): Comment[] {
        return db.comment.getByArticleId(articleId)
    }

    createComment(data: {
        body: string
        articleId: number
        authorId: number
    }): Comment {
        return db.comment.create(data)
    }

    deleteComment(id: number): boolean {
        return db.comment.delete(id)
    }
}
