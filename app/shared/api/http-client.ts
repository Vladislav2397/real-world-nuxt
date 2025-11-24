import axios, { isAxiosError } from 'axios'

export const httpClient = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
    },
})

httpClient.interceptors.response.use(
    response => response,
    error => {
        if (isAxiosError(error) && error.response) {
            throw new ApiError(
                error.response.status,
                error.response.data.errors
            )
        }

        throw error
    }
)

export class ApiError extends Error {
    constructor(
        public code: number,
        public errors: Record<string, string[]>
    ) {
        super('[ApiError]')
    }
}
