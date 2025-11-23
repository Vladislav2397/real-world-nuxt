// import { httpClient } from '../http-client'

const getProfileByUsernameRequest = async (_params: { username: string }) => {
    return {
        profile: {
            username: 'jake',
            bio: 'I work at statefarm',
            image: 'https://api.realworld.io/images/smiley-cyrus.jpg',
            following: false,
        },
    }
}

export const profileApi = {
    getByUsername: getProfileByUsernameRequest,
}
