const useHttpClientPublic = () => {
    const httpClient = $fetch.create({
        baseURL: 'http://localhost:5910',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    return httpClient
}
export default useHttpClientPublic
