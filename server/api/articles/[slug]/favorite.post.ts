import { getRouterParam } from 'h3'
import { authService, articleService } from '../../../services'
import { transformArticle } from '../../../utils/transform'

export default defineEventHandler(async event => {
    const currentUser = await authService.getCurrentUser(event)

    if (!currentUser) {
        throw createError({
            statusCode: 401,
            data: {
                errors: {},
            },
        })
    }

    const slug = getRouterParam(event, 'slug')

    if (!slug) {
        throw createError({
            statusCode: 400,
            message: 'Slug is required',
        })
    }

    const article = await articleService.findArticleBySlug(slug)

    if (!article) {
        throw createError({
            statusCode: 404,
            message: 'Article not found',
        })
    }

    const isSuccess = await articleService.addFavorite(article.id, currentUser.id)

    if (!isSuccess) {
        throw createError({
            statusCode: 400,
            message: 'Article already favorited',
        })
    }

    // Обновляем статью после добавления в избранное
    const updatedArticle = await articleService.findArticleBySlug(slug)

    return {
        article: await transformArticle(updatedArticle!, currentUser.id),
    }
})
