import type { Comment } from '../utils/types'

export class CommentRepository {
    private nextId = 1
    private comments: Comment[] = []

    findById(id: number): Comment | undefined {
        return this.comments.find(comment => comment.id === id)
    }

    getByArticleId(articleId: number): Comment[] {
        return this.comments.filter(comment => comment.articleId === articleId)
    }

    create(data: {
        body: string
        articleId: number
        authorId: number
    }): Comment {
        const now = new Date().toISOString()

        const comment: Comment = {
            id: this.nextId++,
            body: data.body,
            createdAt: now,
            updatedAt: now,
            articleId: data.articleId,
            authorId: data.authorId,
        }

        this.comments.push(comment)
        return comment
    }

    delete(id: number): boolean {
        const index = this.comments.findIndex(comment => comment.id === id)
        if (index === -1) return false

        this.comments.splice(index, 1)
        return true
    }

    getAll(): Comment[] {
        return [...this.comments]
    }

    _set(comments: Comment[]): void {
        this.nextId = comments.length + 1
        this.comments = comments
    }
}
