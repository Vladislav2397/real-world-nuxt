import type { User } from '../utils/types'
import { prisma } from '../utils/prisma'

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

        // Получаем последний активный токен
        const tokenRecord = await prisma.token.findFirst({
            where: {
                userId: id,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        })

        return this.prismaToUser(user, tokenRecord?.token || '')
    }

    async findByEmail(email: string): Promise<User | undefined> {
        const user = await prisma.user.findUnique({
            where: { email },
        })
        if (!user) return undefined

        const tokenRecord = await prisma.token.findFirst({
            where: {
                userId: user.id,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        })

        return this.prismaToUser(user, tokenRecord?.token || '')
    }

    async findByUsername(username: string): Promise<User | undefined> {
        const user = await prisma.user.findUnique({
            where: { username },
        })
        if (!user) return undefined

        const tokenRecord = await prisma.token.findFirst({
            where: {
                userId: user.id,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        })

        return this.prismaToUser(user, tokenRecord?.token || '')
    }

    async findByToken(token: string): Promise<User | undefined> {
        const tokenRecord = await prisma.token.findUnique({
            where: { token },
            include: { user: true },
        })

        if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
            return undefined
        }

        return this.prismaToUser(tokenRecord.user, tokenRecord.token)
    }

    async create(data: {
        email: string
        username: string
        password: string
        token: string
    }): Promise<User> {
        // Создаем токен с истечением через 30 дней
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 30)

        const user = await prisma.user.create({
            data: {
                email: data.email,
                username: data.username,
                password: data.password,
                tokens: {
                    create: {
                        token: data.token,
                        expiresAt,
                    },
                },
            },
        })

        return this.prismaToUser(user, data.token)
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

            const tokenRecord = await prisma.token.findFirst({
                where: {
                    userId: user.id,
                    expiresAt: { gt: new Date() },
                },
                orderBy: { createdAt: 'desc' },
            })

            return this.prismaToUser(user, tokenRecord?.token || '')
        } catch {
            return null
        }
    }

    async getAll(): Promise<User[]> {
        const users = await prisma.user.findMany()
        const usersWithTokens = await Promise.all(
            users.map(async user => {
                const tokenRecord = await prisma.token.findFirst({
                    where: {
                        userId: user.id,
                        expiresAt: { gt: new Date() },
                    },
                    orderBy: { createdAt: 'desc' },
                })
                return this.prismaToUser(user, tokenRecord?.token || '')
            })
        )
        return usersWithTokens
    }
}
