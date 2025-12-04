import type { Follow } from '../utils/types'
import { prisma } from '../utils/prisma'

export class FollowRepository {
    private prismaToFollow(prismaFollow: {
        followerId: number
        followingId: number
    }): Follow {
        return {
            followerId: prismaFollow.followerId,
            followingId: prismaFollow.followingId,
        }
    }

    async isFollowing(
        followerId: number,
        followingId: number
    ): Promise<boolean> {
        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        })
        return follow !== null
    }

    async follow(followerId: number, followingId: number): Promise<boolean> {
        try {
            await prisma.follow.create({
                data: {
                    followerId,
                    followingId,
                },
            })
            return true
        } catch {
            // Уже существует или другая ошибка
            return false
        }
    }

    async unfollow(followerId: number, followingId: number): Promise<boolean> {
        try {
            await prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId,
                        followingId,
                    },
                },
            })
            return true
        } catch {
            return false
        }
    }

    async getFollowers(userId: number): Promise<Follow[]> {
        const follows = await prisma.follow.findMany({
            where: { followingId: userId },
        })
        return follows.map(f => this.prismaToFollow(f))
    }

    async getFollowing(userId: number): Promise<Follow[]> {
        const follows = await prisma.follow.findMany({
            where: { followerId: userId },
        })
        return follows.map(f => this.prismaToFollow(f))
    }

    async getAll(): Promise<Follow[]> {
        const follows = await prisma.follow.findMany()
        return follows.map(f => this.prismaToFollow(f))
    }
}
