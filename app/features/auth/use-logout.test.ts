// @vitest-environment nuxt
import { describe, expect, it, vi } from 'vitest'
import { useLogout } from './use-logout'
import { withNuxtSetup } from '~/shared/lib/test-utils/with-nuxt-setup'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

// Create a hoisted mock for useCookie
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

// Mock the useCookie import
mockNuxtImport('useCookie', () => {
    return useCookieMock
})

describe('useLogout', () => {
    it('should logout a user', async () => {
        const { logout } = await withNuxtSetup(() => useLogout())

        expect(cookieRef.value).toBe('jwt')

        const result = await logout()

        expect(cookieRef.value).toBe('')
        expect(result).toBe(true)
    })
})
