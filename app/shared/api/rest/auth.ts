import { httpClient } from '../http-client'

export type LoginDto = {
    email: string
    password: string
}
const loginRequest = async (data: LoginDto) => {
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

export type RegisterDto = {
    username: string
    email: string
    password: string
}
const registerRequest = async (_data: RegisterDto) => {
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
