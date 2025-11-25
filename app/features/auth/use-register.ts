import { useMutation } from '@tanstack/vue-query'
import type { ApiError } from '~/shared/api/http-client'
import { authApi, type RegisterDto } from '~/shared/api/rest/auth'

export const useRegister = () => {
    const registerMutation = useMutation({
        mutationKey: ['register'],
        mutationFn: authApi.register,
    })

    const token = useCookie('token', { default: () => '' })

    async function register(data: RegisterDto) {
        const result = await registerMutation.mutateAsync(data)

        token.value = result.user.token

        return result.user
    }

    const errors = computed(() => {
        const value = (registerMutation.error.value as ApiError)?.errors

        if (!value) return []

        const email = value.email ?? []
        const password = value.password ?? []

        return [...email, ...password]
    })

    return { register, errors }
}
