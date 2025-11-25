import type { User, Article, Comment } from './types'
import { findUserById } from './users'
import { isArticleFavorited } from './articles'
import { isFollowing } from './profiles'

export const transformUser = (user: User) => {
    return {
        email: user.email,
        token: user.token,
        username: user.username,
        bio: user.bio,
        image: user.image,
    }
}

export const transformProfile = (user: User, currentUserId?: number) => {
    return {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following:
            currentUserId !== undefined
                ? isFollowing(currentUserId, user.id)
                : false,
    }
}

export const transformArticle = (article: Article, currentUserId?: number) => {
    const author = findUserById(article.authorId)
    if (!author) {
        throw new Error(`Author with id ${article.authorId} not found`)
    }

    return {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        favorited:
            currentUserId !== undefined
                ? isArticleFavorited(article.id, currentUserId)
                : false,
        favoritesCount: article.favoritesCount,
        author: transformProfile(author, currentUserId),
    }
}

export const transformArticlePreview = (
    article: Article,
    currentUserId?: number
) => {
    const author = findUserById(article.authorId)
    if (!author) {
        throw new Error(`Author with id ${article.authorId} not found`)
    }

    return {
        slug: article.slug,
        title: article.title,
        description: article.description,
        tagList: article.tagList,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        favorited:
            currentUserId !== undefined
                ? isArticleFavorited(article.id, currentUserId)
                : false,
        favoritesCount: article.favoritesCount,
        author: transformProfile(author, currentUserId),
    }
}

export const transformComment = (comment: Comment, currentUserId?: number) => {
    const author = findUserById(comment.authorId)
    if (!author) {
        throw new Error(`Author with id ${comment.authorId} not found`)
    }

    return {
        id: comment.id,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        body: comment.body,
        author: transformProfile(author, currentUserId),
    }
}
