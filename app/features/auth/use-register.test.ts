// @vitest-environment nuxt
import { describe, expect, it, vi } from 'vitest'
import { useRegister } from './use-register'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { withNuxtSetup } from '~/shared/lib/test-utils/with-nuxt-setup'

// Create a hoisted mock for useCookie
const { cookieRef } = vi.hoisted(() => {
    // Создаем один объект, который будет возвращаться моком
    const cookieRef = { value: '' }
    return { cookieRef }
})

const { useCookieMock } = vi.hoisted(() => {
    return {
        useCookieMock: vi.fn(() => {
            // Возвращаем один и тот же объект, чтобы можно было проверить изменение значения
            return cookieRef
        }),
    }
})

// Mock the useCookie import
mockNuxtImport('useCookie', () => {
    return useCookieMock
})

const { registerMock } = vi.hoisted(() => {
    // Создаем один объект, который будет возвращаться моком
    const registerMock = vi.fn()
    return { registerMock }
})

// Mock authApi.login
vi.mock('~/shared/api/rest/auth', () => ({
    authApi: {
        register: registerMock,
    },
}))

describe('useRegister', () => {
    it('should register a user', async () => {
        registerMock.mockResolvedValue({
            user: {
                email: 'test@test.com',
                token: 'jwt.token.here',
                username: 'testuser',
                bio: '',
                image: null,
            },
        })

        const { register } = await withNuxtSetup(() => useRegister())

        // Проверяем, что значение в cookie было инициализировано правильно
        expect(cookieRef.value).toBe('')

        const result = await register({
            username: 'testuser',
            email: 'test@test.com',
            password: 'password',
        })

        await flushPromises()

        // Проверяем, что useCookie был вызван
        expect(useCookieMock).toHaveBeenCalledTimes(1)
        expect(useCookieMock).toHaveBeenCalledWith('token', {
            default: expect.any(Function),
        })

        // Проверяем, что значение в cookie было установлено правильно
        expect(cookieRef.value).toBe('jwt.token.here')

        // Проверяем, что функция login вернула правильный результат
        expect(result.token).toBe('jwt.token.here')
    })

    it('should return errors if login fails', async () => {
        registerMock.mockRejectedValue({
            errors: {
                email: ['Invalid email'],
                password: ['Password must be at least 8 characters long'],
            },
        })
        const { errors, register } = await withNuxtSetup(() => useRegister())

        try {
            await register({
                username: 'testuser',
                email: 'test@test.com',
                password: 'password',
            })
        } catch {
            //
        }
        await flushPromises()

        expect(errors.value).toStrictEqual([
            'Invalid email',
            'Password must be at least 8 characters long',
        ])
    })
})
