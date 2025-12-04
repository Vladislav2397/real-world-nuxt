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

    async findArticleBySlug(slug: string): Promise<Article | undefined> {
        return await this.articleRepository.findBySlug(slug)
    }

    async findArticleById(id: number): Promise<Article | undefined> {
        return await this.articleRepository.getById(id)
    }

    async createArticle(data: {
        title: string
        description: string
        body: string
        tagList: string[]
        authorId: number
    }): Promise<Article> {
        const slug = await this.generateUniqueSlug(data.title)
        return await this.articleRepository.create({
            slug,
            title: data.title,
            description: data.description,
            body: data.body,
            tagList: data.tagList || [],
            authorId: data.authorId,
        })
    }

    async updateArticle(
        slug: string,
        data: {
            title?: string
            description?: string
            body?: string
            tagList?: string[]
        }
    ): Promise<Article | null> {
        const article = await this.articleRepository.findBySlug(slug)
        if (!article) return null

        const updateData: {
            slug?: string
            title?: string
            description?: string
            body?: string
            tagList?: string[]
        } = { ...data }

        if (data.title !== undefined) {
            updateData.slug = await this.generateUniqueSlug(data.title)
        }

        return await this.articleRepository.update(slug, updateData)
    }

    async deleteArticle(slug: string): Promise<boolean> {
        return await this.articleRepository.delete(slug)
    }

    async getArticles(filters?: {
        tag?: string
        author?: string
        favorited?: string
        limit?: number
        offset?: number
    }): Promise<{ articles: Article[]; articlesCount: number }> {
        const allArticles = await this.articleRepository.getAll()
        let filtered = [...allArticles]

        if (filters?.tag) {
            filtered = filtered.filter(article =>
                article.tagList.includes(filters.tag!)
            )
        }

        if (filters?.author) {
            const author = await this.userRepository.findByUsername(filters.author)
            if (author) {
                filtered = filtered.filter(
                    article => article.authorId === author.id
                )
            } else {
                filtered = []
            }
        }

        if (filters?.favorited) {
            const user = await this.userRepository.findByUsername(filters.favorited)
            if (user) {
                const favoritedArticles = await this.favoriteRepository
                    .getByUserId(user.id)
                const favoritedArticleIds = favoritedArticles.map(fav => fav.articleId)
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

    async getFeedArticles(
        userId: number,
        limit?: number,
        offset?: number
    ): Promise<{ articles: Article[]; articlesCount: number }> {
        const following = await this.followRepository.getFollowing(userId)
        const followingIds = following.map(follow => follow.followingId)

        if (followingIds.length === 0) {
            return { articles: [], articlesCount: 0 }
        }

        const allArticles = await this.articleRepository.getAll()
        let filtered = allArticles.filter(article => followingIds.includes(article.authorId))

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

    async isArticleFavorited(articleId: number, userId: number): Promise<boolean> {
        return await this.favoriteRepository.isFavorited(articleId, userId)
    }

    async addFavorite(articleId: number, userId: number): Promise<boolean> {
        const success = await this.favoriteRepository.add(articleId, userId)
        if (success) {
            await this.articleRepository.updateFavoritesCount(articleId, 1)
        }
        return success
    }

    async removeFavorite(articleId: number, userId: number): Promise<boolean> {
        const success = await this.favoriteRepository.remove(articleId, userId)
        if (success) {
            await this.articleRepository.updateFavoritesCount(articleId, -1)
        }
        return success
    }

    async getAllTags(): Promise<string[]> {
        const tagSet = new Set<string>()
        const articles = await this.articleRepository.getAll()
        articles.forEach(article => {
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

    private async generateUniqueSlug(title: string): Promise<string> {
        const baseSlug = this.createSlug(title)
        let slug = baseSlug
        let counter = 1

        while (await this.articleRepository.findBySlug(slug)) {
            slug = `${baseSlug}-${counter}`
            counter++
        }

        return slug
    }
}
