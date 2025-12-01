import type { User } from '../types'

export class UserRepository {
    private userIdCounter = 1

    constructor(private users: User[]) {}

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

    create(data: { email: string; username: string; password: string }): User {
        const user: User = {
            id: this.userIdCounter++,
            email: data.email,
            username: data.username,
            password: data.password,
            bio: null,
            image: null,
            token: `jwt.token.${data.username}.${Date.now()}`,
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

    authenticate(email: string, password: string): User | null {
        const user = this.findByEmail(email)
        if (!user || user.password !== password) return null
        return user
    }

    getAll(): User[] {
        return [...this.users]
    }

    _set(users: User[]): void {
        this.userIdCounter = users.length + 1
        this.users = users
    }
}
