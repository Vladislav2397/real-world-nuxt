const getProfileByUsernameRequest = async (params: { username: string }) => {
    const httpClient = useHttpClient()
    const response = await httpClient(`/api/profiles/${params.username}`)

    return response
}

const followUserRequest = async (params: { username: string }) => {
    const httpClient = useHttpClient()
    const response = await httpClient(
        `/api/profiles/${params.username}/follow`,
        {
            method: 'POST',
        }
    )

    return response
}

const unfollowUserRequest = async (params: { username: string }) => {
    const httpClient = useHttpClient()
    const response = await httpClient(
        `/api/profiles/${params.username}/follow`,
        {
            method: 'DELETE',
        }
    )

    return response
}

export const profileApi = {
    getByUsername: getProfileByUsernameRequest,
    follow: followUserRequest,
    unfollow: unfollowUserRequest,
}
