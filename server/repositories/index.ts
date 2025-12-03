import { ArticleRepository } from './article.repository'
import { UserRepository } from './user.repository'
import { CommentRepository } from './comment.repository'
import { FavoriteRepository } from './favorite.repository'
import { FollowRepository } from './follow.repository'

export const userRepository = new UserRepository()
export const favoriteRepository = new FavoriteRepository()
export const followRepository = new FollowRepository()
export const commentRepository = new CommentRepository()
export const articleRepository = new ArticleRepository({
    favoriteRepository,
    followRepository,
    userRepository,
})

export const createDb = () => {
    const userRepository = new UserRepository()
    const favoriteRepository = new FavoriteRepository()
    const followRepository = new FollowRepository()
    const commentRepository = new CommentRepository()
    const articleRepository = new ArticleRepository({
        favoriteRepository,
        followRepository,
        userRepository,
    })

    return {
        article: articleRepository,
        user: userRepository,
        comment: commentRepository,
        favorite: favoriteRepository,
        follow: followRepository,
    }
}
