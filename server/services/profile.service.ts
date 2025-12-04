import type { FollowRepository } from '../repositories/follow.repository'

export class ProfileService {
    private followRepository: FollowRepository

    constructor({ followRepository }: { followRepository: FollowRepository }) {
        this.followRepository = followRepository
    }

    async isFollowing(followerId: number, followingId: number): Promise<boolean> {
        return await this.followRepository.isFollowing(followerId, followingId)
    }

    async followUser(followerId: number, followingId: number): Promise<boolean> {
        if (followerId === followingId) return false
        return await this.followRepository.follow(followerId, followingId)
    }

    async unfollowUser(followerId: number, followingId: number): Promise<boolean> {
        return await this.followRepository.unfollow(followerId, followingId)
    }
}
