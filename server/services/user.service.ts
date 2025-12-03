import { db } from '../utils/db'
import type { User } from '../utils/types'

export class UserService {
    findUserByEmail(email: string): User | undefined {
        return db.user.findByEmail(email)
    }

    findUserByUsername(username: string): User | undefined {
        return db.user.findByUsername(username)
    }

    findUserById(id: number): User | undefined {
        return db.user.findById(id)
    }

    findUserByToken(token: string): User | undefined {
        return db.user.findByToken(token)
    }

    createUser(data: {
        email: string
        username: string
        password: string
    }): User {
        return db.user.create(data)
    }

    updateUser(
        userId: number,
        data: {
            email?: string
            username?: string
            password?: string
            bio?: string
            image?: string
        }
    ): User | null {
        return db.user.update(userId, data)
    }

    authenticateUser(email: string, password: string): User | null {
        return db.user.authenticate(email, password)
    }
}
