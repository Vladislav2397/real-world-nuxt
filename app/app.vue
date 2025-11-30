<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { useQueryClient } from '@tanstack/vue-query'
import { useAuthToken } from './features/auth/use-auth-token'
import { getCurrentUserQueryOptions } from './shared/api/query-options/auth'

const queryClient = useQueryClient()

const token = useAuthToken()

onServerPrefetch(async () => {
    if (!token.value) return

    await queryClient.fetchQuery(getCurrentUserQueryOptions())
})
</script>

<style lang="scss" src="./app.scss" />
