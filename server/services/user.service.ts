import type { User } from '../utils/types'
import type { UserRepository } from '../repositories/user.repository'

export class UserService {
    private userRepository: UserRepository

    constructor({ userRepository }: { userRepository: UserRepository }) {
        this.userRepository = userRepository
    }

    findUserByEmail(email: string): User | undefined {
        return this.userRepository.findByEmail(email)
    }

    findUserByUsername(username: string): User | undefined {
        return this.userRepository.findByUsername(username)
    }

    findUserById(id: number): User | undefined {
        return this.userRepository.findById(id)
    }

    findUserByToken(token: string): User | undefined {
        return this.userRepository.findByToken(token)
    }

    createUser(data: {
        email: string
        username: string
        password: string
    }): User {
        const token = this.generateToken(data.username)
        return this.userRepository.create({
            ...data,
            token,
        })
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
        return this.userRepository.update(userId, data)
    }

    authenticateUser(email: string, password: string): User | null {
        const user = this.userRepository.findByEmail(email)
        if (!user || user.password !== password) return null
        return user
    }

    private generateToken(username: string): string {
        return `jwt.token.${username}.${Date.now()}`
    }
}
