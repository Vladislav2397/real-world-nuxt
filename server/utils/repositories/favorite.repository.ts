import type { Favorite } from '../types'

export class FavoriteRepository {
    constructor(private favorites: Favorite[]) {}

    isFavorited(articleId: number, userId: number): boolean {
        return this.favorites.some(
            fav => fav.articleId === articleId && fav.userId === userId
        )
    }

    add(articleId: number, userId: number): boolean {
        const exists = this.isFavorited(articleId, userId)
        if (exists) return false

        this.favorites.push({ articleId, userId })
        return true
    }

    remove(articleId: number, userId: number): boolean {
        const index = this.favorites.findIndex(
            fav => fav.articleId === articleId && fav.userId === userId
        )
        if (index === -1) return false

        this.favorites.splice(index, 1)
        return true
    }

    getByUserId(userId: number): Favorite[] {
        return this.favorites.filter(fav => fav.userId === userId)
    }

    getByArticleId(articleId: number): Favorite[] {
        return this.favorites.filter(fav => fav.articleId === articleId)
    }

    getAll(): Favorite[] {
        return [...this.favorites]
    }

    _set(favorites: Favorite[]): void {
        this.favorites = favorites
    }
}
