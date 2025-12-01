import { db } from './db'

export const isFollowing = (
    followerId: number,
    followingId: number
): boolean => {
    return db.follow.isFollowing(followerId, followingId)
}

export const followUser = (
    followerId: number,
    followingId: number
): boolean => {
    return db.follow.follow(followerId, followingId)
}

export const unfollowUser = (
    followerId: number,
    followingId: number
): boolean => {
    return db.follow.unfollow(followerId, followingId)
}
