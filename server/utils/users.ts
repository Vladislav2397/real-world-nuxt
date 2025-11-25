import { users, getNextUserId } from './store'
import type { User } from './types'

export const findUserByEmail = (email: string): User | undefined => {
    return users.find(user => user.email === email)
}

export const findUserByUsername = (username: string): User | undefined => {
    return users.find(user => user.username === username)
}

export const findUserById = (id: number): User | undefined => {
    return users.find(user => user.id === id)
}

export const findUserByToken = (token: string): User | undefined => {
    return users.find(user => user.token === token)
}

export const createUser = (data: {
    email: string
    username: string
    password: string
}): User => {
    const user: User = {
        id: getNextUserId(),
        email: data.email,
        username: data.username,
        password: data.password,
        bio: null,
        image: null,
        token: `jwt.token.${data.username}.${Date.now()}`,
    }
    users.push(user)
    return user
}

export const updateUser = (
    userId: number,
    data: {
        email?: string
        username?: string
        password?: string
        bio?: string
        image?: string
    }
): User | null => {
    const user = findUserById(userId)
    if (!user) return null

    if (data.email !== undefined) user.email = data.email
    if (data.username !== undefined) user.username = data.username
    if (data.password !== undefined) user.password = data.password
    if (data.bio !== undefined) user.bio = data.bio
    if (data.image !== undefined) user.image = data.image

    return user
}

export const authenticateUser = (
    email: string,
    password: string
): User | null => {
    const user = findUserByEmail(email)
    if (!user || user.password !== password) return null
    return user
}
