// @vitest-environment nuxt
import { useMutation } from '@tanstack/vue-query'
import type { ApiError } from '~/shared/api/http-client'
import { authApi } from '~/shared/api/rest/auth'

export const useLogin = () => {
    const loginMutation = useMutation<
        {
            user: {
                email: string
                token: string
                username: string
                bio: string
                image: string | null
            }
        },
        ApiError,
        { email: string; password: string }
    >({
        mutationKey: ['login'],
        mutationFn: authApi.login,
    })

    const token = useCookie('token', { default: () => '' })

    async function login(data: { email: string; password: string }) {
        const result = await loginMutation.mutateAsync(data)

        token.value = result.user.token

        return result.user
    }

    const errors = computed(() => {
        const value = loginMutation.error.value?.errors

        if (!value) return []

        const email = value.email ?? []
        const password = value.password ?? []

        return [...email, ...password]
    })

    return { login, errors, loginMutation }
}
