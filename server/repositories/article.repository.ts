import type { Article } from '../utils/types'

export class ArticleRepository {
    private nextId = 1
    private articles: Article[] = []

    findBySlug(slug: string): Article | undefined {
        return this.articles.find(article => article.slug === slug)
    }

    getById(id: number): Article | undefined {
        return this.articles.find(article => article.id === id)
    }

    getAll(): Article[] {
        return [...this.articles]
    }

    create(data: {
        slug: string
        title: string
        description: string
        body: string
        tagList: string[]
        authorId: number
    }): Article {
        const now = new Date().toISOString()

        const article: Article = {
            id: this.nextId++,
            slug: data.slug,
            title: data.title,
            description: data.description,
            body: data.body,
            tagList: data.tagList || [],
            createdAt: now,
            updatedAt: now,
            authorId: data.authorId,
            favoritesCount: 0,
        }

        this.articles.push(article)
        return article
    }

    update(
        slug: string,
        data: {
            slug?: string
            title?: string
            description?: string
            body?: string
            tagList?: string[]
        }
    ): Article | null {
        const article = this.findBySlug(slug)
        if (!article) return null

        if (data.slug !== undefined) article.slug = data.slug
        if (data.title !== undefined) article.title = data.title
        if (data.description !== undefined)
            article.description = data.description
        if (data.body !== undefined) article.body = data.body
        if (data.tagList !== undefined) article.tagList = data.tagList

        article.updatedAt = new Date().toISOString()

        return article
    }

    delete(slug: string): boolean {
        const index = this.articles.findIndex(article => article.slug === slug)
        if (index === -1) return false

        this.articles.splice(index, 1)
        return true
    }

    updateFavoritesCount(articleId: number, delta: number): void {
        const article = this.getById(articleId)
        if (article) {
            article.favoritesCount = Math.max(0, article.favoritesCount + delta)
        }
    }

    _set(articles: Article[]): void {
        this.nextId = articles.length + 1
        this.articles = articles
    }
}
