/**
 * Валидирует email адрес
 */
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Валидирует username
 * Минимум 3 символа, только буквы, цифры и подчеркивания
 */
export function validateUsername(username: string): {
    valid: boolean
    error?: string
} {
    if (username.length < 3) {
        return {
            valid: false,
            error: 'Username must be at least 3 characters long',
        }
    }

    if (username.length > 20) {
        return {
            valid: false,
            error: 'Username must be no more than 20 characters long',
        }
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return {
            valid: false,
            error:
                'Username can only contain letters, numbers and underscores',
        }
    }

    return { valid: true }
}

