export default defineEventHandler(async event => {
    const body = await readBody(event)

    return {
        user: {
            email: body?.user?.email || 'jake@jake.jake',
            token: 'jwt.token.here',
            username: body?.user?.username || 'jake',
            bio: body?.user?.bio || 'I work at statefarm',
            image: body?.user?.image || null,
        },
    }
})

