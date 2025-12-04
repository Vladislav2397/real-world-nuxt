import { getQuery } from 'h3'
import { authService, articleService } from '../../services'
import { transformArticlePreview } from '../../utils/transform'

export default defineEventHandler(async event => {
    const currentUser = await authService.getCurrentUser(event)

    if (!currentUser) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const query = getQuery(event)
    const limit = query.limit ? Number(query.limit) : undefined
    const offset = query.offset ? Number(query.offset) : undefined

    const { articles, articlesCount } = await articleService.getFeedArticles(
        currentUser.id,
        limit,
        offset
    )

    return {
        articles: await Promise.all(
            articles.map(article =>
                transformArticlePreview(article, currentUser.id)
            )
        ),
        articlesCount,
    }
})
