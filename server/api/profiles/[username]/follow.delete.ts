export default defineEventHandler(event => {
    const username = getRouterParam(event, 'username')

    return {
        profile: {
            username: username || 'jake',
            bio: 'I work at statefarm',
            image: 'https://api.realworld.io/images/smiley-cyrus.jpg',
            following: false,
        },
    }
})

