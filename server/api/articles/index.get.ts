import { getQuery } from 'h3'
import { getArticles } from '../../utils/articles'
import { transformArticlePreview } from '../../utils/transform'
import { getCurrentUser } from '../../utils/auth'

export default defineEventHandler(event => {
    const query = getQuery(event)
    const currentUser = getCurrentUser(event)

    const filters = {
        tag: query.tag as string | undefined,
        author: query.author as string | undefined,
        favorited: query.favorited as string | undefined,
        limit: query.limit ? Number(query.limit) : undefined,
        offset: query.offset ? Number(query.offset) : undefined,
    }

    const { articles, articlesCount } = getArticles(filters)

    return {
        articles: articles.map(article =>
            transformArticlePreview(article, currentUser?.id)
        ),
        articlesCount,
    }
})
