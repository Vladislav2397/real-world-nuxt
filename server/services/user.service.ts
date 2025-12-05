import type { User } from '../utils/types'
import type { UserRepository } from '../repositories/user.repository'
import { signToken } from '../utils/jwt'
import { hashPassword, comparePassword } from '../utils/password'

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
        // Хешируем пароль перед сохранением
        const hashedPassword = await hashPassword(data.password)

        // Создаем пользователя с хешированным паролем
        const user = await this.userRepository.create({
            ...data,
            password: hashedPassword,
        })

        // Затем создаем JWT токен
        const token = await this.generateToken(user)

        // Возвращаем пользователя с токеном (токен не сохраняется в БД)
        return {
            ...user,
            token,
        }
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
        // Если обновляется пароль, хешируем его
        const updateData = { ...data }
        if (updateData.password) {
            updateData.password = await hashPassword(updateData.password)
        }

        return await this.userRepository.update(userId, updateData)
    }

    async authenticateUser(
        email: string,
        password: string
    ): Promise<User | null> {
        const user = await this.userRepository.findByEmail(email)
        if (!user) return null

        // Сравниваем пароль с хешем (защищено от timing attacks)
        const isPasswordValid = await comparePassword(password, user.password)
        if (!isPasswordValid) return null

        // Создаем новый JWT токен для пользователя
        const token = await this.generateToken(user)

        // Возвращаем пользователя с токеном (токен не сохраняется в БД)
        return {
            ...user,
            token,
        }
    }

    private async generateToken(user: User): Promise<string> {
        return await signToken({
            userId: user.id,
            username: user.username,
            email: user.email,
        })
    }
}
