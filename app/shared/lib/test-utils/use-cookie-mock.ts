import { vi } from 'vitest'

export function createCookieMock() {
    const { cookieRef } = vi.hoisted(() => {
        // Создаем один объект, который будет возвращаться моком
        const cookieRef = { value: 'jwt' }
        return { cookieRef }
    })

    const { useCookieMock } = vi.hoisted(() => {
        return {
            useCookieMock: () => cookieRef,
        }
    })

    return { cookieRef, useCookieMock }
}
