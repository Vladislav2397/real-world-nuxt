import { httpClient } from '../http-client'

const getProfileByUsernameRequest = async (params: { username: string }) => {
    const response = await httpClient.get(`/api/profiles/${params.username}`)

    return response.data
}

const followUserRequest = async (params: { username: string }) => {
    const response = await httpClient.post(
        `/api/profiles/${params.username}/follow`
    )

    return response.data
}

const unfollowUserRequest = async (params: { username: string }) => {
    const response = await httpClient.delete(
        `/api/profiles/${params.username}/follow`
    )

    return response.data
}

export const profileApi = {
    getByUsername: getProfileByUsernameRequest,
    follow: followUserRequest,
    unfollow: unfollowUserRequest,
}
