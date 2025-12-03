import { db } from '../utils/db'

export class ProfileService {
    isFollowing(followerId: number, followingId: number): boolean {
        return db.follow.isFollowing(followerId, followingId)
    }

    followUser(followerId: number, followingId: number): boolean {
        return db.follow.follow(followerId, followingId)
    }

    unfollowUser(followerId: number, followingId: number): boolean {
        return db.follow.unfollow(followerId, followingId)
    }
}
