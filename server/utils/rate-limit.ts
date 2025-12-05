// Простой in-memory rate limiter
// В production рекомендуется использовать Redis или другой внешний хранилище

interface RateLimitEntry {
    count: number
    resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Очистка устаревших записей каждые 5 минут
setInterval(
    () => {
        const now = Date.now()
        for (const [key, entry] of rateLimitStore.entries()) {
            if (entry.resetTime < now) {
                rateLimitStore.delete(key)
            }
        }
    },
    5 * 60 * 1000
)

/**
 * Проверяет rate limit для IP адреса
 * @param identifier - идентификатор (обычно IP адрес)
 * @param maxRequests - максимальное количество запросов
 * @param windowMs - окно времени в миллисекундах
 * @returns true если запрос разрешен, false если превышен лимит
 */
export function checkRateLimit(
    identifier: string,
    maxRequests: number,
    windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const entry = rateLimitStore.get(identifier)

    if (!entry || entry.resetTime < now) {
        // Создаем новую запись
        const resetTime = now + windowMs
        rateLimitStore.set(identifier, {
            count: 1,
            resetTime,
        })
        return {
            allowed: true,
            remaining: maxRequests - 1,
            resetTime,
        }
    }

    if (entry.count >= maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: entry.resetTime,
        }
    }

    // Увеличиваем счетчик
    entry.count++
    return {
        allowed: true,
        remaining: maxRequests - entry.count,
        resetTime: entry.resetTime,
    }
}

/**
 * Получает IP адрес из запроса
 */
export function getClientIP(event: any): string {
    const headers = event.node.req.headers
    return (
        headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        headers['x-real-ip'] ||
        event.node.req.socket?.remoteAddress ||
        'unknown'
    )
}
