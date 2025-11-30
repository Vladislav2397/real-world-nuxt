export type LoginDto = {
    email: string
    password: string
}
const loginRequest = async (data: LoginDto) => {
    const httpClient = useHttpClient()
    const result = await httpClient('/api/users/login', {
        method: 'POST',
        body: {
            user: data,
        },
    })

    return result
}

export type RegisterDto = {
    username: string
    email: string
    password: string
}
const registerRequest = async (data: RegisterDto) => {
    const httpClient = useHttpClient()
    const result = await httpClient('/api/users', {
        method: 'POST',
        body: {
            user: data,
        },
    })

    return result
}

const getCurrentUserRequest = async () => {
    const httpClient = useHttpClient()
    const result = await httpClient('/api/user')

    return result
}

export type UpdateUserDto = {
    email?: string
    username?: string
    password?: string
    bio?: string
    image?: string
}
const updateUserRequest = async (data: UpdateUserDto) => {
    const httpClient = useHttpClient()
    const result = await httpClient('/api/user', {
        method: 'PUT',
        body: {
            user: data,
        },
    })

    return result
}

export const authApi = {
    login: loginRequest,
    register: registerRequest,
    getCurrentUser: getCurrentUserRequest,
    updateUser: updateUserRequest,
}
