import { ArticleService } from './article.service'
import { AuthService } from './auth.service'
import { CommentService } from './comment.service'
import { UserService } from './user.service'
import { ProfileService } from './profile.service'

import {
    articleRepository,
    userRepository,
    followRepository,
    commentRepository,
    favoriteRepository,
} from '../repositories'

export const userService = new UserService({ userRepository })
export const articleService = new ArticleService({
    articleRepository,
    favoriteRepository,
    followRepository,
    userRepository,
})
export const commentService = new CommentService({ commentRepository })
export const profileService = new ProfileService({ followRepository })
export const authService = new AuthService({ userService })
