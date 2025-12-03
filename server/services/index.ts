import { ArticleService } from './article.service'
import { AuthService } from './auth.service'
import { CommentService } from './comment.service'
import { UserService } from './user.service'
import { ProfileService } from './profile.service'

export const userService = new UserService()
export const articleService = new ArticleService()
export const commentService = new CommentService()
export const profileService = new ProfileService()
export const authService = new AuthService({ userService })
