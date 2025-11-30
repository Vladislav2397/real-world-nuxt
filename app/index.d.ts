declare module '#app' {
    interface PageMeta {
        roles?: ('guest' | 'user')[]
    }
    interface NuxtApp {
        $httpClient: typeof $fetch
        $httpClientPublic: typeof $fetch
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $httpClient: typeof $fetch
        $httpClientPublic: typeof $fetch
    }
}

// It is always important to ensure you import/export something when augmenting a type
export {}
