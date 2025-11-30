import { useAuthToken } from '~/features/auth/use-auth-token'
import { ApiError } from '~/shared/api/errors'

const useHttpClient = () => {
    const token = useAuthToken()

    const httpClient = $fetch.create({
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
        onResponseError({ response }) {
            if (response.status && response._data?.errors) {
                throw new ApiError(response.status, response._data.errors)
            }
            throw response._data || new Error('Request failed')
        },
    })

    return httpClient
}
export default useHttpClient
