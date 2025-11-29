<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script lang="ts" setup>
// import { ApiError, httpClient } from './shared/api/http-client'

// const token = useCookie('token', { default: () => '' })

// const isAuthorized = computed(() => !!token.value)

// const { suspense: currentUserSuspense } = useQuery({
//     ...getCurrentUserQueryOptions(),
//     enabled: isAuthorized.value,
// })

// onServerPrefetch(async () => {
//     if (!isAuthorized.value) return

//     try {
//         const result = await httpClient.get('/api/user')

//         console.log(result.data)
//     } catch (e) {
//         if (!(e instanceof ApiError)) return

//         console.log('e.code', e.code)
//     }
// })
</script>

<style lang="scss" src="./app.scss" />
