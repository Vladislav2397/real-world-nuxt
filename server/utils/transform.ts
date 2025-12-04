import type { User, Article, Comment } from './types'
import { userService, articleService, profileService } from '../services'

export const transformUser = (user: User) => {
    return {
        email: user.email,
        token: user.token,
        username: user.username,
        bio: user.bio ?? '',
        image: user.image,
    }
}

export const transformProfile = async (user: User, currentUserId?: number) => {
    return {
        username: user.username,
        bio: user.bio ?? '',
        image: user.image,
        following:
            currentUserId !== undefined
                ? await profileService.isFollowing(currentUserId, user.id)
                : false,
    }
}

export const transformArticle = async (
    article: Article,
    currentUserId?: number
) => {
    const author = await userService.findUserById(article.authorId)
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
                ? await articleService.isArticleFavorited(
                      article.id,
                      currentUserId
                  )
                : false,
        favoritesCount: article.favoritesCount,
        author: await transformProfile(author, currentUserId),
    }
}

export const transformArticlePreview = async (
    article: Article,
    currentUserId?: number
) => {
    const author = await userService.findUserById(article.authorId)
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
        favoritesCount: article.favoritesCount,
        favorited:
            currentUserId !== undefined
                ? await articleService.isArticleFavorited(
                      article.id,
                      currentUserId
                  )
                : false,
        author: await transformProfile(author, currentUserId),
    }
}

export const transformComment = async (
    comment: Comment,
    currentUserId?: number
) => {
    const author = await userService.findUserById(comment.authorId)
    if (!author) {
        throw new Error(`Author with id ${comment.authorId} not found`)
    }

    return {
        id: comment.id,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        body: comment.body,
        author: await transformProfile(author, currentUserId),
    }
}
