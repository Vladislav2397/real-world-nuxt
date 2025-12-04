import type { ArticleRepository } from '../repositories/article.repository'
import type { FavoriteRepository } from '../repositories/favorite.repository'
import type { FollowRepository } from '../repositories/follow.repository'
import type { UserRepository } from '../repositories/user.repository'
import type { Article } from '../utils/types'

export class ArticleService {
    private articleRepository: ArticleRepository
    private favoriteRepository: FavoriteRepository
    private followRepository: FollowRepository
    private userRepository: UserRepository

    constructor({
        articleRepository,
        favoriteRepository,
        followRepository,
        userRepository,
    }: {
        articleRepository: ArticleRepository
        favoriteRepository: FavoriteRepository
        followRepository: FollowRepository
        userRepository: UserRepository
    }) {
        this.articleRepository = articleRepository
        this.favoriteRepository = favoriteRepository
        this.followRepository = followRepository
        this.userRepository = userRepository
    }

    findArticleBySlug(slug: string): Article | undefined {
        return this.articleRepository.findBySlug(slug)
    }

    findArticleById(id: number): Article | undefined {
        return this.articleRepository.getById(id)
    }

    createArticle(data: {
        title: string
        description: string
        body: string
        tagList: string[]
        authorId: number
    }): Article {
        const slug = this.generateUniqueSlug(data.title)
        return this.articleRepository.create({
            slug,
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
        const article = this.articleRepository.findBySlug(slug)
        if (!article) return null

        const updateData: {
            slug?: string
            title?: string
            description?: string
            body?: string
            tagList?: string[]
        } = { ...data }

        if (data.title !== undefined) {
            updateData.slug = this.generateUniqueSlug(data.title)
        }

        return this.articleRepository.update(slug, updateData)
    }

    deleteArticle(slug: string): boolean {
        return this.articleRepository.delete(slug)
    }

    getArticles(filters?: {
        tag?: string
        author?: string
        favorited?: string
        limit?: number
        offset?: number
    }): { articles: Article[]; articlesCount: number } {
        let filtered = [...this.articleRepository.getAll()]

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

        let filtered = this.articleRepository
            .getAll()
            .filter(article => followingIds.includes(article.authorId))

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

    isArticleFavorited(articleId: number, userId: number): boolean {
        return this.favoriteRepository.isFavorited(articleId, userId)
    }

    addFavorite(articleId: number, userId: number): boolean {
        const success = this.favoriteRepository.add(articleId, userId)
        if (success) {
            this.articleRepository.updateFavoritesCount(articleId, 1)
        }
        return success
    }

    removeFavorite(articleId: number, userId: number): boolean {
        const success = this.favoriteRepository.remove(articleId, userId)
        if (success) {
            this.articleRepository.updateFavoritesCount(articleId, -1)
        }
        return success
    }

    getAllTags(): string[] {
        const tagSet = new Set<string>()
        this.articleRepository.getAll().forEach(article => {
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

        while (this.articleRepository.findBySlug(slug)) {
            slug = `${baseSlug}-${counter}`
            counter++
        }

        return slug
    }
}
