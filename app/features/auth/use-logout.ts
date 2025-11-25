export const useLogout = () => {
    const token = useCookie('token', { default: () => '' })

    async function logout() {
        token.value = ''

        return true
    }

    return { logout }
}
