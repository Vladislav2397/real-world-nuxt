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

    async findCommentById(id: number): Promise<Comment | undefined> {
        return await this.commentRepository.findById(id)
    }

    async getCommentsByArticleId(articleId: number): Promise<Comment[]> {
        const comments = await this.commentRepository.getByArticleId(articleId)
        return comments.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
    }

    async createComment(data: {
        body: string
        articleId: number
        authorId: number
    }): Promise<Comment> {
        return await this.commentRepository.create(data)
    }

    async deleteComment(id: number): Promise<boolean> {
        return await this.commentRepository.delete(id)
    }
}
