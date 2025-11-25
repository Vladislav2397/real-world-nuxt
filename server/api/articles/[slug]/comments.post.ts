export default defineEventHandler(async event => {
    const body = await readBody(event)

    return {
        comment: {
            id: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            body: body?.comment?.body || 'It takes a Jacobian',
            author: {
                username: 'jake',
                bio: 'I work at statefarm',
                image: 'https://i.stack.imgur.com/xHWG8.jpg',
                following: false,
            },
        },
    }
})

