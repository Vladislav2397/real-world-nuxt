import { articles, favorites, follows, getNextArticleId } from './store'
import type { Article } from './types'
import { findUserByUsername } from './users'

export const findArticleBySlug = (slug: string): Article | undefined => {
    return articles.find(article => article.slug === slug)
}

export const findArticleById = (id: number): Article | undefined => {
    return articles.find(article => article.id === id)
}

export const createSlug = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export const generateUniqueSlug = (title: string): string => {
    const baseSlug = createSlug(title)
    let slug = baseSlug
    let counter = 1

    while (findArticleBySlug(slug)) {
        slug = `${baseSlug}-${counter}`
        counter++
    }

    return slug
}

export const createArticle = (data: {
    title: string
    description: string
    body: string
    tagList: string[]
    authorId: number
}): Article => {
    const slug = generateUniqueSlug(data.title)
    const now = new Date().toISOString()

    const article: Article = {
        id: getNextArticleId(),
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

    articles.push(article)
    return article
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
    const article = findArticleBySlug(slug)
    if (!article) return null

    if (data.title !== undefined) {
        article.title = data.title
        // Обновляем slug только если изменился title
        article.slug = generateUniqueSlug(data.title)
    }
    if (data.description !== undefined) article.description = data.description
    if (data.body !== undefined) article.body = data.body
    if (data.tagList !== undefined) article.tagList = data.tagList

    article.updatedAt = new Date().toISOString()

    return article
}

export const deleteArticle = (slug: string): boolean => {
    const index = articles.findIndex(article => article.slug === slug)
    if (index === -1) return false

    // Удаляем связанные комментарии и избранное
    // (в реальном приложении это делается через каскадное удаление в БД)
    articles.splice(index, 1)
    return true
}

export const getArticles = (filters?: {
    tag?: string
    author?: string
    favorited?: string
    limit?: number
    offset?: number
}): { articles: Article[]; articlesCount: number } => {
    let filtered = [...articles]

    if (filters?.tag) {
        filtered = filtered.filter(article =>
            article.tagList.includes(filters.tag!)
        )
    }

    if (filters?.author) {
        const author = findUserByUsername(filters.author)
        if (author) {
            filtered = filtered.filter(
                article => article.authorId === author.id
            )
        } else {
            filtered = []
        }
    }

    if (filters?.favorited) {
        const user = findUserByUsername(filters.favorited)
        if (user) {
            const favoritedArticleIds = favorites
                .filter(fav => fav.userId === user.id)
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

export const getFeedArticles = (
    userId: number,
    limit?: number,
    offset?: number
): { articles: Article[]; articlesCount: number } => {
    // Получаем ID пользователей, на которых подписан текущий пользователь
    const followingIds = follows
        .filter(follow => follow.followerId === userId)
        .map(follow => follow.followingId)

    // Если не подписан ни на кого, возвращаем пустой список
    if (followingIds.length === 0) {
        return { articles: [], articlesCount: 0 }
    }

    // Фильтруем статьи по авторам, на которых подписан пользователь
    let filtered = articles.filter(article =>
        followingIds.includes(article.authorId)
    )

    // Сортируем по дате создания (новые первыми)
    filtered.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    const articlesCount = filtered.length
    const actualLimit = limit || 20
    const actualOffset = offset || 0

    filtered = filtered.slice(actualOffset, actualOffset + actualLimit)

    return { articles: filtered, articlesCount }
}

export const isArticleFavorited = (
    articleId: number,
    userId: number
): boolean => {
    return favorites.some(
        fav => fav.articleId === articleId && fav.userId === userId
    )
}

export const addFavorite = (articleId: number, userId: number): boolean => {
    const exists = favorites.some(
        fav => fav.articleId === articleId && fav.userId === userId
    )
    if (exists) return false

    favorites.push({ articleId, userId })
    const article = findArticleById(articleId)
    if (article) {
        article.favoritesCount++
    }
    return true
}

export const removeFavorite = (articleId: number, userId: number): boolean => {
    const index = favorites.findIndex(
        fav => fav.articleId === articleId && fav.userId === userId
    )
    if (index === -1) return false

    favorites.splice(index, 1)
    const article = findArticleById(articleId)
    if (article && article.favoritesCount > 0) {
        article.favoritesCount--
    }
    return true
}

export const getAllTags = (): string[] => {
    const tagSet = new Set<string>()
    articles.forEach(article => {
        article.tagList.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
}
