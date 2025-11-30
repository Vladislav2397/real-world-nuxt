declare module '#app' {
    interface PageMeta {
        roles?: ('guest' | 'user')[]
    }
}

// It is always important to ensure you import/export something when augmenting a type
export {}
