import { getQuery } from 'h3'
import { articleService, authService } from '../../services'
import { transformArticlePreview } from '../../utils/transform'

export default defineEventHandler(async event => {
    const query = getQuery(event)
    const currentUser = await authService.getCurrentUser(event)

    const filters = {
        tag: query.tag as string | undefined,
        author: query.author as string | undefined,
        favorited: query.favorited as string | undefined,
        limit: query.limit ? Number(query.limit) : undefined,
        offset: query.offset ? Number(query.offset) : undefined,
    }

    const { articles, articlesCount } = await articleService.getArticles(filters)

    return {
        articles: await Promise.all(
            articles.map(article =>
                transformArticlePreview(article, currentUser?.id)
            )
        ),
        articlesCount,
    }
})
