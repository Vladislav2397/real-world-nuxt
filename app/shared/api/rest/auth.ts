import { httpClient } from '../http-client'

const loginRequest = async (data: { email: string; password: string }) => {
    const result = await httpClient.post('/api/users/login', data)

    return result.data as {
        user: {
            email: string
            token: string
            username: string
            bio: string
            image: string | null
        }
    }

    // if (data.email === 'test@test.com' && data.password === 'password') {
    //     return {
    //         user: {
    //             email: 'jake@jake.jake',
    //             token: 'jwt.token.here',
    //             username: 'jake',
    //             bio: 'I work at statefarm',
    //             image: null,
    //         },
    //     }
    // }

    // throw new Error('Invalid email or password')
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
