// @vitest-environment nuxt
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useToggleFollow } from './use-toggle-follow'
import { flushPromises } from '@vue/test-utils'
import { withNuxtSetup } from '~/shared/lib/test-utils/with-nuxt-setup'
import type { Profile } from '~/shared/api/contracts/article'

const { followMock } = vi.hoisted(() => {
    const followMock = vi.fn()
    return { followMock }
})

const { unfollowMock } = vi.hoisted(() => {
    const unfollowMock = vi.fn()
    return { unfollowMock }
})

const { queryClientMock } = vi.hoisted(() => {
    const invalidateQueriesMock = vi.fn().mockResolvedValue(undefined)
    const queryClientMock = {
        invalidateQueries: invalidateQueriesMock,
    }
    return { queryClientMock, invalidateQueriesMock }
})

vi.mock('~/shared/api/rest/profile', () => ({
    profileApi: {
        follow: followMock,
        unfollow: unfollowMock,
    },
}))

vi.mock('@tanstack/vue-query', async () => {
    const actual = await vi.importActual('@tanstack/vue-query')
    return {
        ...actual,
        useQueryClient: () => queryClientMock,
        useMutation: ({ mutationFn, onSuccess }: any) => {
            return {
                mutateAsync: async () => {
                    const result = await mutationFn()
                    if (onSuccess) {
                        await onSuccess(result)
                    }
                    return result
                },
            }
        },
    }
})

describe('useToggleFollow', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should follow a user when profile is not following', async () => {
        followMock.mockResolvedValue({
            profile: {
                username: 'testuser',
                following: true,
                bio: '',
                image: null,
            },
        })

        const profile = ref<Pick<Profile, 'username' | 'following'>>({
            username: 'testuser',
            following: false,
        })

        const { toggle } = await withNuxtSetup(() => useToggleFollow(profile))

        await toggle()
        await flushPromises()

        expect(followMock).toHaveBeenCalledTimes(1)
        expect(followMock).toHaveBeenCalledWith({ username: 'testuser' })
        expect(unfollowMock).not.toHaveBeenCalled()
        expect(queryClientMock.invalidateQueries).toHaveBeenCalledTimes(1)
        expect(queryClientMock.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ['user', 'testuser'],
        })
    })

    it('should unfollow a user when profile is following', async () => {
        unfollowMock.mockResolvedValue({
            profile: {
                username: 'testuser',
                following: false,
                bio: '',
                image: null,
            },
        })

        const profile = ref<Pick<Profile, 'username' | 'following'>>({
            username: 'testuser',
            following: true,
        })

        const { toggle } = await withNuxtSetup(() => useToggleFollow(profile))

        await toggle()
        await flushPromises()

        expect(unfollowMock).toHaveBeenCalledTimes(1)
        expect(unfollowMock).toHaveBeenCalledWith({ username: 'testuser' })
        expect(followMock).not.toHaveBeenCalled()
        expect(queryClientMock.invalidateQueries).toHaveBeenCalledTimes(1)
        expect(queryClientMock.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ['user', 'testuser'],
        })
    })

    it('should invalidate profile query after follow', async () => {
        followMock.mockResolvedValue({
            profile: {
                username: 'anotheruser',
                following: true,
                bio: '',
                image: null,
            },
        })

        const profile = ref<Pick<Profile, 'username' | 'following'>>({
            username: 'anotheruser',
            following: false,
        })

        const { toggle } = await withNuxtSetup(() => useToggleFollow(profile))

        await toggle()
        await flushPromises()

        expect(queryClientMock.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ['user', 'anotheruser'],
        })
    })

    it('should invalidate profile query after unfollow', async () => {
        unfollowMock.mockResolvedValue({
            profile: {
                username: 'anotheruser',
                following: false,
                bio: '',
                image: null,
            },
        })

        const profile = ref<Pick<Profile, 'username' | 'following'>>({
            username: 'anotheruser',
            following: true,
        })

        const { toggle } = await withNuxtSetup(() => useToggleFollow(profile))

        await toggle()
        await flushPromises()

        expect(queryClientMock.invalidateQueries).toHaveBeenCalledWith({
            queryKey: ['user', 'anotheruser'],
        })
    })
})
