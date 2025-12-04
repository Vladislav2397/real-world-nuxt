import type { FollowRepository } from '../repositories/follow.repository'

export class ProfileService {
    private followRepository: FollowRepository

    constructor({ followRepository }: { followRepository: FollowRepository }) {
        this.followRepository = followRepository
    }

    isFollowing(followerId: number, followingId: number): boolean {
        return this.followRepository.isFollowing(followerId, followingId)
    }

    followUser(followerId: number, followingId: number): boolean {
        if (followerId === followingId) return false
        return this.followRepository.follow(followerId, followingId)
    }

    unfollowUser(followerId: number, followingId: number): boolean {
        return this.followRepository.unfollow(followerId, followingId)
    }
}
