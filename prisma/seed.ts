import 'dotenv/config'
import type { Article, User } from './generated/client'
import { PrismaClient } from './generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { faker } from '@faker-js/faker'
import { hashPassword } from '../server/utils/password'

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// Функция для создания slug из title
function createSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

// Функция для генерации уникального slug
async function generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = createSlug(title)
    let slug = baseSlug
    let counter = 1

    while (await prisma.article.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`
        counter++
    }

    return slug
}

async function main() {
    console.log(`Start seeding ...`)

    // Очищаем базу данных
    await prisma.favorite.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.article.deleteMany()
    await prisma.follow.deleteMany()
    await prisma.token.deleteMany()
    await prisma.user.deleteMany()

    // Создаем 5 пользователей
    const users: User[] = [
        await prisma.user.create({
            data: {
                username: 'jake',
                email: 'jake@jake.jake',
                password: await hashPassword('jakejake'),
                bio: 'I work at statefarm',
                image: null,
            },
        }),
    ]
    for (let i = 0; i < 5; i++) {
        const password = faker.internet.password({ length: 12 })
        const hashedPassword = await hashPassword(password)

        const user = await prisma.user.create({
            data: {
                username: faker.internet.username(),
                email: faker.internet.email(),
                password: hashedPassword,
                bio: faker.person.bio(),
                image: faker.image.avatar(),
            },
        })
        users.push(user)
        console.log(`Created user: ${user.username} (id: ${user.id})`)
    }

    // Создаем статьи для каждого пользователя (3-5 статей)
    const articles: Article[] = []
    const possibleTags = [
        'react',
        'vue',
        'javascript',
        'typescript',
        'nodejs',
        'nuxt',
        'programming',
        'webdev',
        'tutorial',
        'tips',
    ]

    for (const user of users) {
        const articlesCount = faker.number.int({ min: 3, max: 10 })
        for (let i = 0; i < articlesCount; i++) {
            const title = faker.lorem.sentence()
            const slug = await generateUniqueSlug(title)

            const article = await prisma.article.create({
                data: {
                    slug,
                    title,
                    description: faker.lorem.paragraph(),
                    body: faker.lorem.paragraphs(
                        faker.number.int({ min: 3, max: 8 })
                    ),
                    tagList: faker.helpers.arrayElements(
                        possibleTags,
                        faker.number.int({ min: 1, max: 4 })
                    ),
                    authorId: user.id,
                },
            })
            articles.push(article)
            console.log(
                `Created article: "${article.title}" by ${user.username}`
            )
        }
    }

    // Добавляем лайки на статьи
    // Каждая статья получает несколько лайков от разных пользователей
    for (const article of articles) {
        // Количество лайков для статьи (от 0 до 4)
        const likesCount = faker.number.int({ min: 0, max: 4 })
        // Выбираем случайных пользователей для лайков
        const usersWhoLiked = faker.helpers.arrayElements(users, likesCount)

        for (const user of usersWhoLiked) {
            // Пользователь не может лайкнуть свою собственную статью
            if (user.id !== article.authorId) {
                try {
                    await prisma.favorite.create({
                        data: {
                            userId: user.id,
                            articleId: article.id,
                        },
                    })
                    console.log(
                        `User ${user.username} liked article "${article.title}"`
                    )
                } catch (error) {
                    // Игнорируем ошибки дублирования (если лайк уже существует)
                    if (
                        !(error as { code?: string }).code ||
                        (error as { code: string }).code !== 'P2002'
                    ) {
                        throw error
                    }
                }
            }
        }
    }

    // Добавляем комментарии к статьям
    // Каждая статья получает несколько комментариев от разных пользователей
    for (const article of articles) {
        // Количество комментариев для статьи (от 1 до 5)
        const commentsCount = faker.number.int({ min: 1, max: 5 })
        // Выбираем случайных пользователей для комментариев
        const usersWhoCommented = faker.helpers.arrayElements(
            users,
            Math.min(commentsCount, users.length)
        )

        for (const user of usersWhoCommented) {
            await prisma.comment.create({
                data: {
                    body: faker.lorem.paragraphs(
                        faker.number.int({ min: 1, max: 3 })
                    ),
                    userId: user.id,
                    articleId: article.id,
                },
            })
            console.log(
                `User ${user.username} commented on article "${article.title}"`
            )
        }
    }

    console.log(`Seeding finished.`)
    console.log(`Created:`)
    console.log(`  - ${users.length} users`)
    console.log(`  - ${articles.length} articles`)
    const favoritesCount = await prisma.favorite.count()
    console.log(`  - ${favoritesCount} favorites`)
    const commentsCount = await prisma.comment.count()
    console.log(`  - ${commentsCount} comments`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async e => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
