import type { User } from '../utils/types'
import type { UserRepository } from '../repositories/user.repository'

export class UserService {
    private userRepository: UserRepository

    constructor({ userRepository }: { userRepository: UserRepository }) {
        this.userRepository = userRepository
    }

    async findUserByEmail(email: string): Promise<User | undefined> {
        return await this.userRepository.findByEmail(email)
    }

    async findUserByUsername(username: string): Promise<User | undefined> {
        return await this.userRepository.findByUsername(username)
    }

    async findUserById(id: number): Promise<User | undefined> {
        return await this.userRepository.findById(id)
    }

    async findUserByToken(token: string): Promise<User | undefined> {
        return await this.userRepository.findByToken(token)
    }

    async createUser(data: {
        email: string
        username: string
        password: string
    }): Promise<User> {
        const token = this.generateToken(data.username)
        return await this.userRepository.create({
            ...data,
            token,
        })
    }

    async updateUser(
        userId: number,
        data: {
            email?: string
            username?: string
            password?: string
            bio?: string
            image?: string
        }
    ): Promise<User | null> {
        return await this.userRepository.update(userId, data)
    }

    async authenticateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findByEmail(email)
        if (!user || user.password !== password) return null
        return user
    }

    private generateToken(username: string): string {
        return `jwt.token.${username}.${Date.now()}`
    }
}
