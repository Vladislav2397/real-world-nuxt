import type { Comment } from '../utils/types'
import { prisma } from '../utils/prisma'

export class CommentRepository {
    private prismaToComment(prismaComment: {
        id: number
        body: string
        createdAt: Date
        updatedAt: Date
        articleId: number
        userId: number
    }): Comment {
        return {
            id: prismaComment.id,
            body: prismaComment.body,
            createdAt: prismaComment.createdAt.toISOString(),
            updatedAt: prismaComment.updatedAt.toISOString(),
            articleId: prismaComment.articleId,
            authorId: prismaComment.userId,
        }
    }

    async findById(id: number): Promise<Comment | undefined> {
        const comment = await prisma.comment.findUnique({
            where: { id },
        })
        if (!comment) return undefined
        return this.prismaToComment(comment)
    }

    async getByArticleId(articleId: number): Promise<Comment[]> {
        const comments = await prisma.comment.findMany({
            where: { articleId },
            orderBy: { createdAt: 'desc' },
        })
        return comments.map(c => this.prismaToComment(c))
    }

    async create(data: {
        body: string
        articleId: number
        authorId: number
    }): Promise<Comment> {
        const comment = await prisma.comment.create({
            data: {
                body: data.body,
                articleId: data.articleId,
                userId: data.authorId,
            },
        })
        return this.prismaToComment(comment)
    }

    async delete(id: number): Promise<boolean> {
        try {
            await prisma.comment.delete({
                where: { id },
            })
            return true
        } catch {
            return false
        }
    }

    async getAll(): Promise<Comment[]> {
        const comments = await prisma.comment.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return comments.map(c => this.prismaToComment(c))
    }
}
