import { queryOptions } from '@tanstack/vue-query'

export const getCurrentUserQueryOptions = () => {
    const httpClient = useHttpClient()

    return queryOptions({
        queryKey: ['current-user'],
        queryFn: () => httpClient('/api/user'),
    })
}
