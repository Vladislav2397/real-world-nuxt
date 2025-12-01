import { db } from './db'
import type { User } from './types'

export const findUserByEmail = (email: string): User | undefined => {
    return db.user.findByEmail(email)
}

export const findUserByUsername = (username: string): User | undefined => {
    return db.user.findByUsername(username)
}

export const findUserById = (id: number): User | undefined => {
    return db.user.findById(id)
}

export const findUserByToken = (token: string): User | undefined => {
    return db.user.findByToken(token)
}

export const createUser = (data: {
    email: string
    username: string
    password: string
}): User => {
    return db.user.create(data)
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
    return db.user.update(userId, data)
}

export const authenticateUser = (
    email: string,
    password: string
): User | null => {
    return db.user.authenticate(email, password)
}
