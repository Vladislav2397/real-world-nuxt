import { queryOptions } from '@tanstack/vue-query'
import { authApi } from '../rest/auth'

export const getCurrentUserQueryOptions = () => {
    return queryOptions({
        queryKey: ['current-user'],
        queryFn: () => authApi.getCurrentUser(),
    })
}
