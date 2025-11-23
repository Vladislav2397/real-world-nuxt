const loginRequest = async (_data: { email: string; password: string }) => {
    return {
        user: {
            email: 'jake@jake.jake',
            token: 'jwt.token.here',
            username: 'jake',
            bio: 'I work at statefarm',
            image: null,
        },
    }
}

const registerRequest = async (_data: {
    username: string
    email: string
    password: string
}) => {
    return {
        user: {
            email: 'jake@jake.jake',
            token: 'jwt.token.here',
            username: 'jake',
            bio: 'I work at statefarm',
            image: null,
        },
    }
}

export const authApi = {
    login: loginRequest,
    register: registerRequest,
}
