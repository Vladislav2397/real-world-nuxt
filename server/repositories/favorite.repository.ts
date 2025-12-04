import type { Favorite } from '../utils/types'
import { prisma } from '../utils/prisma'

export class FavoriteRepository {
    private prismaToFavorite(prismaFavorite: {
        userId: number
        articleId: number
    }): Favorite {
        return {
            userId: prismaFavorite.userId,
            articleId: prismaFavorite.articleId,
        }
    }

    async isFavorited(articleId: number, userId: number): Promise<boolean> {
        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_articleId: {
                    userId,
                    articleId,
                },
            },
        })
        return favorite !== null
    }

    async add(articleId: number, userId: number): Promise<boolean> {
        try {
            await prisma.favorite.create({
                data: {
                    articleId,
                    userId,
                },
            })
            return true
        } catch {
            // Уже существует или другая ошибка
            return false
        }
    }

    async remove(articleId: number, userId: number): Promise<boolean> {
        try {
            await prisma.favorite.delete({
                where: {
                    userId_articleId: {
                        userId,
                        articleId,
                    },
                },
            })
            return true
        } catch {
            return false
        }
    }

    async getByUserId(userId: number): Promise<Favorite[]> {
        const favorites = await prisma.favorite.findMany({
            where: { userId },
        })
        return favorites.map(f => this.prismaToFavorite(f))
    }

    async getByArticleId(articleId: number): Promise<Favorite[]> {
        const favorites = await prisma.favorite.findMany({
            where: { articleId },
        })
        return favorites.map(f => this.prismaToFavorite(f))
    }

    async getAll(): Promise<Favorite[]> {
        const favorites = await prisma.favorite.findMany()
        return favorites.map(f => this.prismaToFavorite(f))
    }
}
