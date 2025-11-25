import { getQuery } from 'h3'
import { getCurrentUser } from '../../utils/auth'
import { getFeedArticles } from '../../utils/articles'
import { transformArticlePreview } from '../../utils/transform'

export default defineEventHandler(event => {
    const currentUser = getCurrentUser(event)

    if (!currentUser) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const query = getQuery(event)
    const limit = query.limit ? Number(query.limit) : undefined
    const offset = query.offset ? Number(query.offset) : undefined

    const { articles, articlesCount } = getFeedArticles(
        currentUser.id,
        limit,
        offset
    )

    return {
        articles: articles.map(article =>
            transformArticlePreview(article, currentUser.id)
        ),
        articlesCount,
    }
})
