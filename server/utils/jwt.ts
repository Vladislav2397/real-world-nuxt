import { SignJWT, jwtVerify } from 'jose'

// Получаем секретный ключ из переменных окружения или используем дефолтный для разработки
const getSecret = (): Uint8Array => {
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
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
    
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30d')
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

