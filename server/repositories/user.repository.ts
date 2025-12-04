import type { User } from '../utils/types'

export class UserRepository {
    private nextId = 1
    private users: User[] = []

    findById(id: number): User | undefined {
        return this.users.find(user => user.id === id)
    }

    findByEmail(email: string): User | undefined {
        return this.users.find(user => user.email === email)
    }

    findByUsername(username: string): User | undefined {
        return this.users.find(user => user.username === username)
    }

    findByToken(token: string): User | undefined {
        return this.users.find(user => user.token === token)
    }

    create(data: {
        email: string
        username: string
        password: string
        token: string
    }): User {
        const user: User = {
            id: this.nextId++,
            email: data.email,
            username: data.username,
            password: data.password,
            bio: null,
            image: null,
            token: data.token,
        }
        this.users.push(user)
        return user
    }

    update(
        userId: number,
        data: {
            email?: string
            username?: string
            password?: string
            bio?: string
            image?: string
        }
    ): User | null {
        const user = this.findById(userId)
        if (!user) return null

        if (data.email !== undefined) user.email = data.email
        if (data.username !== undefined) user.username = data.username
        if (data.password !== undefined) user.password = data.password
        if (data.bio !== undefined) user.bio = data.bio
        if (data.image !== undefined) user.image = data.image

        return user
    }

    getAll(): User[] {
        return [...this.users]
    }

    _set(users: User[]): void {
        this.nextId = users.length + 1
        this.users = users
    }
}
