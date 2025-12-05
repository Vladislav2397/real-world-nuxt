import { SignJWT, jwtVerify } from 'jose'

// Получаем секретный ключ из переменных окружения
const getSecret = (): Uint8Array => {
    const secret = process.env.JWT_SECRET

    // В production обязательно должен быть установлен JWT_SECRET
    if (!secret) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error(
                'JWT_SECRET environment variable is required in production'
            )
        }
        // Для разработки используем дефолтный ключ с предупреждением
        console.warn(
            '⚠️  WARNING: Using default JWT_SECRET. Set JWT_SECRET environment variable in production!'
        )
        return new TextEncoder().encode(
            'your-secret-key-change-in-production'
        )
    }

    // Проверяем минимальную длину секрета
    if (secret.length < 32) {
        throw new Error(
            'JWT_SECRET must be at least 32 characters long for security'
        )
    }

    return new TextEncoder().encode(secret)
}

export interface JWTPayload {
    userId: number
    username: string
    email: string
}

/**
 * Создает JWT токен для пользователя
 */
export async function signToken(payload: JWTPayload): Promise<string> {
    const secret = getSecret()
    
    // Сокращаем срок жизни токена до 7 дней для лучшей безопасности
    // В production можно использовать еще более короткий срок (например, 1 день)
    const expirationTime = process.env.JWT_EXPIRATION_TIME || '7d'
    
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expirationTime)
        .sign(secret)

    return token
}

/**
 * Верифицирует JWT токен и возвращает payload
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const secret = getSecret()
        const { payload } = await jwtVerify(token, secret)
        
        return {
            userId: payload.userId as number,
            username: payload.username as string,
            email: payload.email as string,
        }
    } catch (error) {
        return null
    }
}

