import { db } from '../utils/db'
import type { Article } from '../utils/types'

export class ArticleService {
    findArticleBySlug(slug: string): Article | undefined {
        return db.article.findBySlug(slug)
    }

    findArticleById(id: number): Article | undefined {
        return db.article.getById(id)
    }

    createArticle(data: {
        title: string
        description: string
        body: string
        tagList: string[]
        authorId: number
    }): Article {
        return db.article.create({
            title: data.title,
            description: data.description,
            body: data.body,
            tagList: data.tagList || [],
            authorId: data.authorId,
        })
    }

    updateArticle(
        slug: string,
        data: {
            title?: string
            description?: string
            body?: string
            tagList?: string[]
        }
    ): Article | null {
        return db.article.update(slug, data)
    }

    deleteArticle(slug: string): boolean {
        return db.article.delete(slug)
    }

    getArticles(filters?: {
        tag?: string
        author?: string
        favorited?: string
        limit?: number
        offset?: number
    }): { articles: Article[]; articlesCount: number } {
        return db.article.getArticles(filters)
    }

    getFeedArticles(
        userId: number,
        limit?: number,
        offset?: number
    ): { articles: Article[]; articlesCount: number } {
        return db.article.getFeedArticles(userId, limit, offset)
    }

    isArticleFavorited(articleId: number, userId: number): boolean {
        return db.article.isFavorited(articleId, userId)
    }

    addFavorite(articleId: number, userId: number): boolean {
        return db.article.addFavorite(articleId, userId)
    }

    removeFavorite(articleId: number, userId: number): boolean {
        return db.article.removeFavorite(articleId, userId)
    }

    getAllTags(): string[] {
        return db.article.getAllTags()
    }
}

export const articleService = new ArticleService()
