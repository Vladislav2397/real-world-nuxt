export const useLogout = () => {
    const token = useCookie('token')

    async function logout() {
        token.value = null

        return true
    }

    return { logout }
}
