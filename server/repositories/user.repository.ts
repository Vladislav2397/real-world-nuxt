import type { User } from '../utils/types'
import { prisma } from '../utils/prisma'
import { verifyToken } from '../utils/jwt'

export class UserRepository {
    private prismaToUser(
        prismaUser: {
            id: number
            email: string
            username: string
            password: string
            bio: string | null
            image: string | null
        },
        token: string
    ): User {
        return {
            id: prismaUser.id,
            email: prismaUser.email,
            username: prismaUser.username,
            password: prismaUser.password,
            bio: prismaUser.bio,
            image: prismaUser.image,
            token,
        }
    }

    async findById(id: number): Promise<User | undefined> {
        const user = await prisma.user.findUnique({
            where: { id },
        })
        if (!user) return undefined

        // JWT токены не хранятся в БД, возвращаем пользователя без токена
        return this.prismaToUser(user, '')
    }

    async findByEmail(email: string): Promise<User | undefined> {
        const user = await prisma.user.findUnique({
            where: { email },
        })
        if (!user) return undefined

        // JWT токены не хранятся в БД, возвращаем пользователя без токена
        return this.prismaToUser(user, '')
    }

    async findByUsername(username: string): Promise<User | undefined> {
        const user = await prisma.user.findUnique({
            where: { username },
        })
        if (!user) return undefined

        // JWT токены не хранятся в БД, возвращаем пользователя без токена
        return this.prismaToUser(user, '')
    }

    async findByToken(token: string): Promise<User | undefined> {
        // Валидируем JWT токен
        const payload = await verifyToken(token)
        if (!payload) {
            return undefined
        }

        // Находим пользователя по userId из токена
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        })

        if (!user) {
            return undefined
        }

        // Возвращаем пользователя с токеном
        return this.prismaToUser(user, token)
    }

    async create(data: {
        email: string
        username: string
        password: string
    }): Promise<User> {
        // JWT токены не хранятся в БД
        const user = await prisma.user.create({
            data: {
                email: data.email,
                username: data.username,
                password: data.password,
            },
        })

        // Возвращаем пользователя без токена (токен будет создан в сервисе)
        return this.prismaToUser(user, '')
    }

    async update(
        userId: number,
        data: {
            email?: string
            username?: string
            password?: string
            bio?: string
            image?: string
        }
    ): Promise<User | null> {
        try {
            const user = await prisma.user.update({
                where: { id: userId },
                data: {
                    ...(data.email !== undefined && { email: data.email }),
                    ...(data.username !== undefined && {
                        username: data.username,
                    }),
                    ...(data.password !== undefined && {
                        password: data.password,
                    }),
                    ...(data.bio !== undefined && { bio: data.bio }),
                    ...(data.image !== undefined && { image: data.image }),
                },
            })

            // JWT токены не хранятся в БД, возвращаем пользователя без токена
            return this.prismaToUser(user, '')
        } catch {
            return null
        }
    }

    async getAll(): Promise<User[]> {
        const users = await prisma.user.findMany()
        // JWT токены не хранятся в БД, возвращаем пользователей без токенов
        return users.map(user => this.prismaToUser(user, ''))
    }
}
