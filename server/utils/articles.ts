import { db } from './db'
import type { Article } from './types'

export const findArticleBySlug = (slug: string): Article | undefined => {
    return db.article.findBySlug(slug)
}

export const findArticleById = (id: number): Article | undefined => {
    return db.article.getById(id)
}

export const createArticle = (data: {
    title: string
    description: string
    body: string
    tagList: string[]
    authorId: number
}): Article => {
    return db.article.create({
        title: data.title,
        description: data.description,
        body: data.body,
        tagList: data.tagList || [],
        authorId: data.authorId,
    })
}

export const updateArticle = (
    slug: string,
    data: {
        title?: string
        description?: string
        body?: string
        tagList?: string[]
    }
): Article | null => {
    return db.article.update(slug, data)
}

export const deleteArticle = (slug: string): boolean => {
    return db.article.delete(slug)
}

export const getArticles = (filters?: {
    tag?: string
    author?: string
    favorited?: string
    limit?: number
    offset?: number
}): { articles: Article[]; articlesCount: number } => {
    return db.article.getArticles(filters)
}

export const getFeedArticles = (
    userId: number,
    limit?: number,
    offset?: number
): { articles: Article[]; articlesCount: number } => {
    return db.article.getFeedArticles(userId, limit, offset)
}

export const isArticleFavorited = (
    articleId: number,
    userId: number
): boolean => {
    return db.article.isFavorited(articleId, userId)
}

export const addFavorite = (articleId: number, userId: number): boolean => {
    return db.article.addFavorite(articleId, userId)
}

export const removeFavorite = (articleId: number, userId: number): boolean => {
    return db.article.removeFavorite(articleId, userId)
}

export const getAllTags = (): string[] => {
    return db.article.getAllTags()
}
