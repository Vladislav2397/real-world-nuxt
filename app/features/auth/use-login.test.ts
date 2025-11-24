// @vitest-environment nuxt
import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { useLogin } from './use-login'
import { flushPromises } from '@vue/test-utils'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'

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

// Mock authApi.login
vi.mock('~/shared/api/rest/auth', () => ({
    authApi: {
        login: vi.fn(async () => ({
            user: {
                email: 'test@test.com',
                token: 'jwt.token.here',
                username: 'testuser',
                bio: '',
                image: null,
            },
        })),
    },
}))

describe('useLogin', () => {
    it('should login and save token to cookie', async () => {
        const { login } = await withNuxtSetup(() => useLogin())

        // Проверяем, что значение в cookie было инициализировано правильно
        expect(cookieRef.value).toBe('')

        const result = await login({
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
        expect(result.user.token).toBe('jwt.token.here')
    })

    it('should return errors if login fails', async () => {
        // Mock authApi.login
        vi.mock('~/shared/api/rest/auth', () => ({
            authApi: {
                login: vi.fn().mockRejectedValue({
                    errors: {
                        body: ['Invalid email or password'],
                    },
                }),
            },
        }))
        const { errors, login } = await withNuxtSetup(() => useLogin())

        const result = await login({
            email: 'test@test.com',
            password: 'password',
        })

        expect(errors.value).toEqual(['Invalid email or password'])
    })
})

async function withNuxtSetup<T>(useFn: () => T): Promise<T> {
    let result!: T

    const Comp = defineComponent({
        setup() {
            result = useFn()
            return () => null
        },
    })

    await mountSuspended(Comp)
    return result
}
