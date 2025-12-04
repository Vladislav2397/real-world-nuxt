import { ArticleRepository } from './article.repository'
import { UserRepository } from './user.repository'
import { CommentRepository } from './comment.repository'
import { FavoriteRepository } from './favorite.repository'
import { FollowRepository } from './follow.repository'

export const userRepository = new UserRepository()
export const favoriteRepository = new FavoriteRepository()
export const followRepository = new FollowRepository()
export const commentRepository = new CommentRepository()
export const articleRepository = new ArticleRepository()
