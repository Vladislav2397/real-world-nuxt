import { ArticleRepository } from './article.repository'
import { UserRepository } from './user.repository'
import { CommentRepository } from './comment.repository'
import { FavoriteRepository } from './favorite.repository'
import { FollowRepository } from './follow.repository'
import { faker } from '@faker-js/faker'

export const createDb = () => {
    const userRepository = new UserRepository([])
    const favoriteRepository = new FavoriteRepository([])
    const followRepository = new FollowRepository([])
    const commentRepository = new CommentRepository([])
    const articleRepository = new ArticleRepository(
        [],
        favoriteRepository,
        followRepository,
        userRepository
    )

    return {
        article: articleRepository,
        user: userRepository,
        comment: commentRepository,
        favorite: favoriteRepository,
        follow: followRepository,
    }
}

export const seedDb = (db: ReturnType<typeof createDb>) => {
    // Инициализация faker с фиксированным seed для воспроизводимости
    faker.seed(42)

    // Генерация пользователей (5 пользователей)
    const generateUsers = (): User[] => {
        const users: User[] = [
            // Сохраняем существующего пользователя jake
            {
                id: 1,
                email: 'jake@jake.jake',
                username: 'jake',
                password: 'jakejake',
                bio: 'I work at statefarm',
                image: null,
                token: 'jwt.token.here',
            },
        ]

        // Генерируем еще 4 пользователя
        for (let i = 2; i <= 5; i++) {
            users.push({
                id: i,
                email: faker.internet.email().toLowerCase(),
                username: faker.internet.username().toLowerCase(),
                password: faker.internet.password(),
                bio: faker.person.bio(),
                image: faker.image.avatar(),
                token: faker.string.alphanumeric(32),
            })
        }

        return users
    }

    // Генерация статей (30 статей)
    const generateArticles = (userIds: number[]): Article[] => {
        const articles: Article[] = []
        const tags = [
            'dragons',
            'training',
            'javascript',
            'vue',
            'nuxt',
            'typescript',
            'programming',
            'web-development',
            'frontend',
            'backend',
            'react',
            'nodejs',
            'tutorial',
            'tips',
            'best-practices',
            'coding',
            'software',
            'technology',
            'design',
            'ui',
        ]

        for (let i = 1; i <= 30; i++) {
            const authorId = faker.helpers.arrayElement(userIds)
            const createdAt = faker.date.past({ years: 2 }).toISOString()
            const updatedAt = faker.date
                .between({ from: createdAt, to: new Date() })
                .toISOString()
            const title = faker.lorem.sentence({ min: 3, max: 8 })
            const slug = faker.helpers.slugify(title).toLowerCase()

            // Подсчитываем количество избранных для этой статьи
            const favoritesCount = faker.number.int({ min: 0, max: 15 })

            articles.push({
                id: i,
                slug,
                title,
                description: faker.lorem.sentence({ min: 5, max: 15 }),
                body: faker.lorem.paragraphs({ min: 3, max: 8 }),
                tagList: faker.helpers.arrayElements(tags, { min: 1, max: 5 }),
                createdAt,
                updatedAt,
                authorId,
                favoritesCount,
            })
        }

        return articles
    }

    // Генерация комментариев (15 комментариев)
    const generateComments = (
        articleIds: number[],
        userIds: number[]
    ): Comment[] => {
        const comments: Comment[] = []

        for (let i = 1; i <= 15; i++) {
            const articleId = faker.helpers.arrayElement(articleIds)
            const authorId = faker.helpers.arrayElement(userIds)
            const createdAt = faker.date.past({ years: 1 }).toISOString()
            const updatedAt = faker.date
                .between({ from: createdAt, to: new Date() })
                .toISOString()

            comments.push({
                id: i,
                body: faker.lorem.paragraph({ min: 1, max: 3 }),
                createdAt,
                updatedAt,
                articleId,
                authorId,
            })
        }

        return comments
    }

    // Генерация избранных статей
    const generateFavorites = (
        articleIds: number[],
        userIds: number[]
    ): Favorite[] => {
        const favorites: Favorite[] = []
        const favoriteCount = faker.number.int({ min: 5, max: 20 })

        for (let i = 0; i < favoriteCount; i++) {
            const userId = faker.helpers.arrayElement(userIds)
            const articleId = faker.helpers.arrayElement(articleIds)

            // Проверяем, чтобы не было дубликатов
            const exists = favorites.some(
                f => f.userId === userId && f.articleId === articleId
            )

            if (!exists) {
                favorites.push({
                    userId,
                    articleId,
                })
            }
        }

        return favorites
    }

    // Генерация подписок
    const generateFollows = (userIds: number[]): Follow[] => {
        const follows: Follow[] = []
        const followCount = faker.number.int({ min: 3, max: 10 })

        for (let i = 0; i < followCount; i++) {
            const followerId = faker.helpers.arrayElement(userIds)
            let followingId = faker.helpers.arrayElement(userIds)

            // Убеждаемся, что пользователь не подписывается сам на себя
            while (followingId === followerId) {
                followingId = faker.helpers.arrayElement(userIds)
            }

            // Проверяем, чтобы не было дубликатов
            const exists = follows.some(
                f =>
                    f.followerId === followerId && f.followingId === followingId
            )

            if (!exists) {
                follows.push({
                    followerId,
                    followingId,
                })
            }
        }

        return follows
    }

    // Инициализация данных
    const generatedUsers = generateUsers()
    const generatedArticles = generateArticles(generatedUsers.map(u => u.id))
    const generatedComments = generateComments(
        generatedArticles.map(a => a.id),
        generatedUsers.map(u => u.id)
    )
    const generatedFavorites = generateFavorites(
        generatedArticles.map(a => a.id),
        generatedUsers.map(u => u.id)
    )
    const generatedFollows = generateFollows(generatedUsers.map(u => u.id))

    // Хранилище данных в памяти
    const users: User[] = generatedUsers
    const articles: Article[] = generatedArticles
    const comments: Comment[] = generatedComments
    const favorites: Favorite[] = generatedFavorites
    const follows: Follow[] = generatedFollows

    db.user._set(users)
    db.article._set(articles)
    db.comment._set(comments)
    db.favorite._set(favorites)
    db.follow._set(follows)

    return db
}
