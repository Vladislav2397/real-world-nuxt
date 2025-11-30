import type { User, Article, Comment, Favorite, Follow } from './types'

// Хранилище данных в памяти
export const users: User[] = [
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

export const articles: Article[] = [
    {
        id: 1,
        slug: 'how-to-train-your-dragon',
        title: 'How to train your dragon',
        description: 'Ever wonder how?',
        body: 'It takes a Jacobian',
        tagList: ['dragons', 'training'],
        createdAt: '2016-02-18T03:22:56.637Z',
        updatedAt: '2016-02-18T03:48:35.824Z',
        authorId: 1,
        favoritesCount: 0,
    },
    {
        id: 2,
        slug: 'how-to-train-your-dragon-2',
        title: 'How to train your dragon 2',
        description: 'So toothless',
        body: 'It takes a Jacobian',
        tagList: ['dragons'],
        createdAt: '2016-02-18T03:22:56.637Z',
        updatedAt: '2016-02-18T03:48:35.824Z',
        authorId: 1,
        favoritesCount: 0,
    },
]

export const comments: Comment[] = [
    {
        id: 1,
        body: 'It takes a Jacobian',
        createdAt: '2016-02-18T03:22:56.637Z',
        updatedAt: '2016-02-18T03:22:56.637Z',
        articleId: 1,
        authorId: 1,
    },
]

export const favorites: Favorite[] = []

export const follows: Follow[] = []

// Счетчики для генерации ID
let userIdCounter = 2
let articleIdCounter = 3
let commentIdCounter = 2

export const getNextUserId = () => userIdCounter++
export const getNextArticleId = () => articleIdCounter++
export const getNextCommentId = () => commentIdCounter++
