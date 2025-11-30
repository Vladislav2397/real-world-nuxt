export class ApiError extends Error {
    constructor(
        public code: number,
        public errors: Record<string, string[]>
    ) {
        super('[ApiError]')
        this.name = 'ApiError'
    }
}

