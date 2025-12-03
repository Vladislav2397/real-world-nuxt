import type { Follow } from '../utils/types'

export class FollowRepository {
    private follows: Follow[] = []

    isFollowing(followerId: number, followingId: number): boolean {
        return this.follows.some(
            follow =>
                follow.followerId === followerId &&
                follow.followingId === followingId
        )
    }

    follow(followerId: number, followingId: number): boolean {
        if (followerId === followingId) return false

        const exists = this.isFollowing(followerId, followingId)
        if (exists) return false

        this.follows.push({ followerId, followingId })
        return true
    }

    unfollow(followerId: number, followingId: number): boolean {
        const index = this.follows.findIndex(
            follow =>
                follow.followerId === followerId &&
                follow.followingId === followingId
        )
        if (index === -1) return false

        this.follows.splice(index, 1)
        return true
    }

    getFollowers(userId: number): Follow[] {
        return this.follows.filter(follow => follow.followingId === userId)
    }

    getFollowing(userId: number): Follow[] {
        return this.follows.filter(follow => follow.followerId === userId)
    }

    getAll(): Follow[] {
        return [...this.follows]
    }

    _set(follows: Follow[]): void {
        this.follows = follows
    }
}
