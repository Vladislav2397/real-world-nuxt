// @vitest-environment nuxt
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useLogin } from './use-login'
import { flushPromises } from '@vue/test-utils'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
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

const { loginMock } = vi.hoisted(() => {
    // Создаем один объект, который будет возвращаться моком
    const loginMock = vi.fn()
    return { loginMock }
})

// Mock authApi.login
vi.mock('~/shared/api/rest/auth', () => ({
    authApi: {
        login: loginMock,
    },
}))

// Mock useMutation from @tanstack/vue-query
vi.mock('@tanstack/vue-query', async () => {
    const actual = await vi.importActual('@tanstack/vue-query')
    return {
        ...actual,
        useMutation: ({ mutationFn }: any) => {
            const error = ref(null)
            return {
                mutateAsync: async (data: any) => {
                    try {
                        const result = await mutationFn(data)
                        error.value = null
                        return result
                    } catch (err) {
                        error.value = err
                        throw err
                    }
                },
                error,
            }
        },
    }
})

describe('useLogin', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        cookieRef.value = ''
    })

    it('should login and save token to cookie', async () => {
        loginMock.mockResolvedValue({
            user: {
                email: 'test@test.com',
                token: 'jwt.token.here',
                username: 'testuser',
                bio: '',
                image: null,
            },
        })

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
        expect(useCookieMock).toHaveBeenCalledWith('token')

        // Проверяем, что значение в cookie было установлено правильно
        expect(cookieRef.value).toBe('jwt.token.here')

        // Проверяем, что функция login вернула правильный результат
        expect(result.token).toBe('jwt.token.here')
    })

    it('should return errors if login fails', async () => {
        loginMock.mockRejectedValue({
            errors: {
                email: ['Invalid email or password'],
            },
        })
        const { errors, login } = await withNuxtSetup(() => useLogin())

        try {
            await login({
                email: 'test@test.com',
                password: 'password',
            })
        } catch {
            //
        }
        await flushPromises()

        expect(errors.value).toStrictEqual(['Invalid email or password'])
    })

    it('should return empty errors if login is successful', async () => {
        loginMock.mockRejectedValue({
            errors: {
                email: ['Invalid email'],
                password: ['Invalid password'],
            },
        })
        const { errors, login } = await withNuxtSetup(() => useLogin())

        try {
            await login({
                email: 'test@test.com',
                password: 'password',
            })
        } catch {
            //
        }
        await flushPromises()

        expect(errors.value).toStrictEqual([
            'Invalid email',
            'Invalid password',
        ])
    })
})
