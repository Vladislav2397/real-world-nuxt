export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('token', { default: () => '' })
    const isAuth = computed(() => !!token.value)

    const viewerRole = isAuth.value ? 'user' : 'guest'

    const roles = (to.meta.roles as string[] | undefined) ?? ['guest', 'user']

    console.debug('auth-guard', {
        viewerRole,
        roles,
        to: to.name,
        from: from.name,
    })

    if (roles.includes(viewerRole)) {
        return
    }

    if (viewerRole === 'guest') {
        return navigateTo('/login')
    }

    return navigateTo('/')
})
