import type { Article } from '../utils/types'
import { prisma } from '../utils/prisma'

export class ArticleRepository {
    private async getFavoritesCount(articleId: number): Promise<number> {
        return await prisma.favorite.count({
            where: { articleId },
        })
    }

    private async prismaToArticle(prismaArticle: {
        id: number
        slug: string
        title: string
        description: string
        body: string
        tagList: string[]
        createdAt: Date
        updatedAt: Date
        authorId: number
    }): Promise<Article> {
        const favoritesCount = await this.getFavoritesCount(prismaArticle.id)
        return {
            id: prismaArticle.id,
            slug: prismaArticle.slug,
            title: prismaArticle.title,
            description: prismaArticle.description,
            body: prismaArticle.body,
            tagList: prismaArticle.tagList,
            createdAt: prismaArticle.createdAt.toISOString(),
            updatedAt: prismaArticle.updatedAt.toISOString(),
            authorId: prismaArticle.authorId,
            favoritesCount,
        }
    }

    async findBySlug(slug: string): Promise<Article | undefined> {
        const article = await prisma.article.findUnique({
            where: { slug },
        })
        if (!article) return undefined
        return await this.prismaToArticle(article)
    }

    async getById(id: number): Promise<Article | undefined> {
        const article = await prisma.article.findUnique({
            where: { id },
        })
        if (!article) return undefined
        return await this.prismaToArticle(article)
    }

    async getAll(): Promise<Article[]> {
        const articles = await prisma.article.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return Promise.all(articles.map(a => this.prismaToArticle(a)))
    }

    async create(data: {
        slug: string
        title: string
        description: string
        body: string
        tagList: string[]
        authorId: number
    }): Promise<Article> {
        const article = await prisma.article.create({
            data: {
                slug: data.slug,
                title: data.title,
                description: data.description,
                body: data.body,
                tagList: data.tagList || [],
                authorId: data.authorId,
            },
        })
        return await this.prismaToArticle(article)
    }

    async update(
        slug: string,
        data: {
            slug?: string
            title?: string
            description?: string
            body?: string
            tagList?: string[]
        }
    ): Promise<Article | null> {
        const existing = await prisma.article.findUnique({
            where: { slug },
        })
        if (!existing) return null

        const article = await prisma.article.update({
            where: { slug },
            data: {
                ...(data.slug !== undefined && { slug: data.slug }),
                ...(data.title !== undefined && { title: data.title }),
                ...(data.description !== undefined && {
                    description: data.description,
                }),
                ...(data.body !== undefined && { body: data.body }),
                ...(data.tagList !== undefined && { tagList: data.tagList }),
            },
        })
        return await this.prismaToArticle(article)
    }

    async delete(slug: string): Promise<boolean> {
        try {
            await prisma.article.delete({
                where: { slug },
            })
            return true
        } catch {
            return false
        }
    }

    async updateFavoritesCount(
        _articleId: number,
        _delta: number
    ): Promise<void> {
        // В Prisma favoritesCount вычисляется динамически, поэтому этот метод не нужен
        // Оставлен для совместимости с существующим кодом
    }
}
