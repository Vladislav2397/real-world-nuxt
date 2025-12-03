import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../prisma/generated/client'

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
}

const prismaClientSingleton = () => {
    const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL,
    })
    return new PrismaClient({ adapter })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const usePrisma = () => {
    return prisma
}
