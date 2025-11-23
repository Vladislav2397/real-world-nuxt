const getArticleListRequest = async (_params: { username?: string }) => {
    return {
        articles: [
            {
                slug: 'how-to-train-your-dragon',
                title: 'How to train your dragon',
                description: 'Ever wonder how?',
                tagList: ['dragons', 'training'],
                createdAt: '2016-02-18T03:22:56.637Z',
                updatedAt: '2016-02-18T03:48:35.824Z',
                favorited: false,
                favoritesCount: 0,
                author: {
                    username: 'jake',
                    bio: 'I work at statefarm',
                    image: 'https://i.stack.imgur.com/xHWG8.jpg',
                    following: false,
                },
            },
            {
                slug: 'how-to-train-your-dragon-2',
                title: 'How to train your dragon 2',
                description: 'So toothless',
                tagList: ['dragons', 'training'],
                createdAt: '2016-02-18T03:22:56.637Z',
                updatedAt: '2016-02-18T03:48:35.824Z',
                favorited: false,
                favoritesCount: 0,
                author: {
                    username: 'jake',
                    bio: 'I work at statefarm',
                    image: 'https://i.stack.imgur.com/xHWG8.jpg',
                    following: false,
                },
            },
        ],
        articlesCount: 2,
    }
}

const getArticleBySlugRequest = async (_params: { slug: string }) => {
    return {
        article: {
            slug: 'how-to-train-your-dragon',
            title: 'How to train your dragon',
            description: 'Ever wonder how?',
            body: 'It takes a Jacobian',
            tagList: ['dragons', 'training'],
            createdAt: '2016-02-18T03:22:56.637Z',
            updatedAt: '2016-02-18T03:48:35.824Z',
            favorited: false,
            favoritesCount: 0,
            author: {
                username: 'jake',
                bio: 'I work at statefarm',
                image: 'https://i.stack.imgur.com/xHWG8.jpg',
                following: false,
            },
        },
    }
}

const getCommentListRequest = async (_params: { slug: string }) => {
    return {
        comments: [
            {
                id: 1,
                createdAt: '2016-02-18T03:22:56.637Z',
                updatedAt: '2016-02-18T03:22:56.637Z',
                body: 'It takes a Jacobian',
                author: {
                    username: 'jake',
                    bio: 'I work at statefarm',
                    image: 'https://i.stack.imgur.com/xHWG8.jpg',
                    following: false,
                },
            },
        ],
    }
}

const getCommentByIdRequest = async (_id: number) => {
    return {
        comment: {
            id: 1,
            createdAt: '2016-02-18T03:22:56.637Z',
            updatedAt: '2016-02-18T03:22:56.637Z',
            body: 'It takes a Jacobian',
            author: {
                username: 'jake',
                bio: 'I work at statefarm',
                image: 'https://i.stack.imgur.com/xHWG8.jpg',
                following: false,
            },
        },
    }
}

const getTagListRequest = async () => {
    return {
        tags: ['reactjs', 'angularjs'],
    }
}

export const articleApi = {
    getList: getArticleListRequest,
    getBySlug: getArticleBySlugRequest,
    getComments: getCommentListRequest,
    getCommentById: getCommentByIdRequest,
    getTagList: getTagListRequest,
}
