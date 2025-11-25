import { httpClient } from '../http-client'

export type LoginDto = {
    email: string
    password: string
}
const loginRequest = async (data: LoginDto) => {
    const result = await httpClient.post('/api/users/login', {
        user: data,
    })

    return result.data
}

export type RegisterDto = {
    username: string
    email: string
    password: string
}
const registerRequest = async (data: RegisterDto) => {
    const result = await httpClient.post('/api/users', {
        user: data,
    })

    return result.data
}

const getCurrentUserRequest = async () => {
    const result = await httpClient.get('/api/user')

    return result.data
}

export type UpdateUserDto = {
    email?: string
    username?: string
    password?: string
    bio?: string
    image?: string
}
const updateUserRequest = async (data: UpdateUserDto) => {
    const result = await httpClient.put('/api/user', {
        user: data,
    })

    return result.data
}

export const authApi = {
    login: loginRequest,
    register: registerRequest,
    getCurrentUser: getCurrentUserRequest,
    updateUser: updateUserRequest,
}
