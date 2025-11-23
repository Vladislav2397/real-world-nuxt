import { useMutation } from '@tanstack/vue-query'
import { authApi } from '~/shared/api/rest/auth'

export const useLogin = () => {
    const { mutateAsync: login } = useMutation({
        mutationKey: ['login'],
        mutationFn: authApi.login,
    })

    const token = useCookie('token', { default: () => '' })

    async function handleSubmit(e: Event) {
        const formData = new FormData(e.target as HTMLFormElement)

        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const result = await login({ email, password })

        token.value = result.user.token

        navigateTo('/')
    }

    return { handleSubmit }
}
