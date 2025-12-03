import type { Article } from '../utils/types'
import type { FavoriteRepository } from './favorite.repository'
import type { FollowRepository } from './follow.repository'
import type { UserRepository } from './user.repository'

export class ArticleRepository {
    private nextId = 1
    private articles: Article[] = []
    private favoriteRepository: FavoriteRepository
    private followRepository: FollowRepository
    private userRepository: UserRepository

    constructor({
        favoriteRepository,
        followRepository,
        userRepository,
    }: {
        favoriteRepository: FavoriteRepository
        followRepository: FollowRepository
        userRepository: UserRepository
    }) {
        this.favoriteRepository = favoriteRepository
        this.followRepository = followRepository
        this.userRepository = userRepository
    }

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
        title: string
        description: string
        body: string
        tagList: string[]
        authorId: number
    }): Article {
        const slug = this.generateUniqueSlug(data.title)
        const now = new Date().toISOString()

        const article: Article = {
            id: this.nextId++,
            slug,
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
            title?: string
            description?: string
            body?: string
            tagList?: string[]
        }
    ): Article | null {
        const article = this.findBySlug(slug)
        if (!article) return null

        if (data.title !== undefined) {
            article.title = data.title
            article.slug = this.generateUniqueSlug(data.title)
        }
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

    getArticles(filters?: {
        tag?: string
        author?: string
        favorited?: string
        limit?: number
        offset?: number
    }): { articles: Article[]; articlesCount: number } {
        let filtered = [...this.articles]

        if (filters?.tag) {
            filtered = filtered.filter(article =>
                article.tagList.includes(filters.tag!)
            )
        }

        if (filters?.author) {
            const author = this.userRepository.findByUsername(filters.author)
            if (author) {
                filtered = filtered.filter(
                    article => article.authorId === author.id
                )
            } else {
                filtered = []
            }
        }

        if (filters?.favorited) {
            const user = this.userRepository.findByUsername(filters.favorited)
            if (user) {
                const favoritedArticleIds = this.favoriteRepository
                    .getByUserId(user.id)
                    .map(fav => fav.articleId)
                filtered = filtered.filter(article =>
                    favoritedArticleIds.includes(article.id)
                )
            } else {
                filtered = []
            }
        }

        const articlesCount = filtered.length
        const limit = filters?.limit || 20
        const offset = filters?.offset || 0

        filtered = filtered.slice(offset, offset + limit)

        return { articles: filtered, articlesCount }
    }

    getFeedArticles(
        userId: number,
        limit?: number,
        offset?: number
    ): { articles: Article[]; articlesCount: number } {
        const following = this.followRepository.getFollowing(userId)
        const followingIds = following.map(follow => follow.followingId)

        if (followingIds.length === 0) {
            return { articles: [], articlesCount: 0 }
        }

        let filtered = this.articles.filter(article =>
            followingIds.includes(article.authorId)
        )

        filtered.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )

        const articlesCount = filtered.length
        const actualLimit = limit || 20
        const actualOffset = offset || 0

        filtered = filtered.slice(actualOffset, actualOffset + actualLimit)

        return { articles: filtered, articlesCount }
    }

    isFavorited(articleId: number, userId: number): boolean {
        return this.favoriteRepository.isFavorited(articleId, userId)
    }

    addFavorite(articleId: number, userId: number): boolean {
        const success = this.favoriteRepository.add(articleId, userId)
        if (success) {
            const article = this.getById(articleId)
            if (article) {
                article.favoritesCount++
            }
        }
        return success
    }

    removeFavorite(articleId: number, userId: number): boolean {
        const success = this.favoriteRepository.remove(articleId, userId)
        if (success) {
            const article = this.getById(articleId)
            if (article && article.favoritesCount > 0) {
                article.favoritesCount--
            }
        }
        return success
    }

    getAllTags(): string[] {
        const tagSet = new Set<string>()
        this.articles.forEach(article => {
            article.tagList.forEach(tag => tagSet.add(tag))
        })
        return Array.from(tagSet).sort()
    }

    private createSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    private generateUniqueSlug(title: string): string {
        const baseSlug = this.createSlug(title)
        let slug = baseSlug
        let counter = 1

        while (this.findBySlug(slug)) {
            slug = `${baseSlug}-${counter}`
            counter++
        }

        return slug
    }

    _set(articles: Article[]): void {
        this.nextId = articles.length + 1
        this.articles = articles
    }
}
