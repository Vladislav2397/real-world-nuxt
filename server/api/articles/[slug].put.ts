import { getRouterParam } from 'h3'
import { authService, articleService } from '../../services'
import { transformArticle } from '../../utils/transform'

export default defineEventHandler(async event => {
    const currentUser = authService.getCurrentUser(event)

    if (!currentUser) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const slug = getRouterParam(event, 'slug')

    if (!slug) {
        throw createError({
            statusCode: 400,
            message: 'Slug is required',
        })
    }

    const article = articleService.findArticleBySlug(slug)

    if (!article) {
        throw createError({
            statusCode: 404,
            message: 'Article not found',
        })
    }

    if (article.authorId !== currentUser.id) {
        throw createError({
            statusCode: 403,
            message: 'Forbidden',
        })
    }

    const body = await readBody(event)

    const updatedArticle = articleService.updateArticle(slug, {
        title: body?.article?.title,
        description: body?.article?.description,
        body: body?.article?.body,
        tagList: body?.article?.tagList,
    })

    if (!updatedArticle) {
        throw createError({
            statusCode: 404,
            message: 'Article not found',
        })
    }

    return {
        article: transformArticle(updatedArticle, currentUser.id),
    }
})
