import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Profile } from '~/shared/api/contracts/article'
import { profileApi } from '~/shared/api/rest/profile'

export const useToggleFollow = (
    profile: Ref<Pick<Profile, 'username' | 'following'>>
) => {
    const queryClient = useQueryClient()

    const isFollowing = computed(() => profile.value.following)
    const username = computed(() => profile.value.username)

    const followUserMutation = useMutation({
        mutationKey: ['profile', username, 'follow'],
        mutationFn: () => profileApi.follow({ username: username.value }),
        onSuccess: async () => {
            // Инвалидируем запросы профиля, чтобы обновить статус following
            await queryClient.invalidateQueries({
                queryKey: ['user', username.value],
            })
        },
    })

    const unfollowUserMutation = useMutation({
        mutationKey: ['profile', username, 'unfollow'],
        mutationFn: () => profileApi.unfollow({ username: username.value }),
        onSuccess: async () => {
            // Инвалидируем запросы профиля, чтобы обновить статус following
            await queryClient.invalidateQueries({
                queryKey: ['user', username.value],
            })
        },
    })

    async function toggle() {
        if (isFollowing.value) {
            await unfollowUserMutation.mutateAsync()
        } else {
            await followUserMutation.mutateAsync()
        }
    }

    return { toggle }
}
