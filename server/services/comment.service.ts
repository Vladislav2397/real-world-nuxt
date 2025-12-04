import type { CommentRepository } from '../repositories/comment.repository'
import type { Comment } from '../utils/types'

export class CommentService {
    private commentRepository: CommentRepository

    constructor({
        commentRepository,
    }: {
        commentRepository: CommentRepository
    }) {
        this.commentRepository = commentRepository
    }

    findCommentById(id: number): Comment | undefined {
        return this.commentRepository.findById(id)
    }

    getCommentsByArticleId(articleId: number): Comment[] {
        const comments = this.commentRepository.getByArticleId(articleId)
        return comments.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
    }

    createComment(data: {
        body: string
        articleId: number
        authorId: number
    }): Comment {
        return this.commentRepository.create(data)
    }

    deleteComment(id: number): boolean {
        return this.commentRepository.delete(id)
    }
}
