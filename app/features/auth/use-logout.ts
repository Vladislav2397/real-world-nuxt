export const useLogout = () => {
    const token = useCookie('token', { default: () => '' })

    function handleLogout() {
        token.value = ''
        navigateTo('/')
    }

    return { handleLogout }
}
