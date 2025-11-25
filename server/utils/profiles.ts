import { follows } from './store'

export const isFollowing = (
    followerId: number,
    followingId: number
): boolean => {
    return follows.some(
        follow =>
            follow.followerId === followerId &&
            follow.followingId === followingId
    )
}

export const followUser = (
    followerId: number,
    followingId: number
): boolean => {
    if (followerId === followingId) return false

    const exists = isFollowing(followerId, followingId)
    if (exists) return false

    follows.push({ followerId, followingId })
    return true
}

export const unfollowUser = (
    followerId: number,
    followingId: number
): boolean => {
    const index = follows.findIndex(
        follow =>
            follow.followerId === followerId &&
            follow.followingId === followingId
    )
    if (index === -1) return false

    follows.splice(index, 1)
    return true
}
