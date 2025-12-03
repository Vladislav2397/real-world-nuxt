import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../prisma/generated/client'

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
}

const prismaClientSingleton = () => {
    try {
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL!,
        })
        return new PrismaClient({ adapter })
    } catch (error) {
        // Гарантируем, что ошибка является стандартным Error объектом
        if (error instanceof Error) {
            throw error
        }
        throw new Error(`Failed to initialize Prisma client: ${String(error)}`)
    }
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

let prisma: PrismaClientSingleton

try {
    prisma = globalForPrisma.prisma ?? prismaClientSingleton()
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
} catch (error) {
    // Гарантируем, что ошибка является стандартным Error объектом
    if (error instanceof Error) {
        throw error
    }
    throw new Error(`Failed to initialize Prisma client: ${String(error)}`)
}

export const usePrisma = () => {
    return prisma
}
