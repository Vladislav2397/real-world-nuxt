import { useAuthToken } from '~/features/auth/use-auth-token'

export default defineNuxtPlugin(() => {
    const httpClientPublic = $fetch.create({
        baseURL: 'http://localhost:5910',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const token = useAuthToken()

    const httpClient = $fetch.create({
        baseURL: 'http://localhost:5910',
        headers: {
            'Content-Type': 'application/json',
        },
        onRequest({ options }) {
            if (token.value) {
                const headers = options.headers as unknown as Record<
                    string,
                    string
                >
                options.headers = {
                    ...headers,
                    Authorization: `Bearer ${token.value}`,
                } as unknown as Headers
            }
        },
    })

    return {
        provide: {
            $httpClientPublic: httpClientPublic,
            $httpClient: httpClient,
        },
    }
})
