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

    const body = await readBody(event)

    if (
        !body?.article?.title ||
        !body?.article?.description ||
        !body?.article?.body
    ) {
        throw createError({
            statusCode: 422,
            message: 'Title, description and body are required',
        })
    }

    const article = articleService.createArticle({
        title: body.article.title,
        description: body.article.description,
        body: body.article.body,
        tagList: body.article.tagList || [],
        authorId: currentUser.id,
    })

    return {
        article: transformArticle(article, currentUser.id),
    }
})
