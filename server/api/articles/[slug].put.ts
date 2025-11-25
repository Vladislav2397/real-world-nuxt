export default defineEventHandler(async event => {
    const slug = getRouterParam(event, 'slug')
    const body = await readBody(event)

    return {
        article: {
            slug: slug || 'how-to-train-your-dragon',
            title: body?.article?.title || 'How to train your dragon',
            description: body?.article?.description || 'Ever wonder how?',
            body: body?.article?.body || 'It takes a Jacobian',
            tagList: body?.article?.tagList || ['dragons', 'training'],
            createdAt: '2016-02-18T03:22:56.637Z',
            updatedAt: new Date().toISOString(),
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
})

