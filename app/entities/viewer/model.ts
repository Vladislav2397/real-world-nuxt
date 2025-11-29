import { useQuery } from '@tanstack/vue-query'
import { getCurrentUserQueryOptions } from '~/shared/api/query-options/auth'

export function useViewer() {
    const token = useCookie('token', { default: () => '' })

    const isAuthorized = computed(() => !!token.value)

    const { data: currentUserData, suspense: currentUserSuspense } = useQuery({
        ...getCurrentUserQueryOptions(),
        enabled: isAuthorized,
    })

    const viewer = computed(() => currentUserData.value?.user ?? null)

    return { currentUserData, viewer, currentUserSuspense }
}
