export type User = {
    id: number
    email: string
    username: string
    password: string
    bio: string | null
    image: string | null
    token: string
}

export type Article = {
    id: number
    slug: string
    title: string
    description: string
    body: string
    tagList: string[]
    createdAt: string
    updatedAt: string
    authorId: number
    favoritesCount: number
}

export type Comment = {
    id: number
    body: string
    createdAt: string
    updatedAt: string
    articleId: number
    authorId: number
}

export type Favorite = {
    userId: number
    articleId: number
}

export type Follow = {
    followerId: number
    followingId: number
}
