<template>
    <NuxtLink
        :to="`/editor/${article.slug}`"
        class="btn btn-sm btn-outline-secondary"
    >
        <i class="ion-edit"></i> Edit Article
    </NuxtLink>
</template>

<script setup lang="ts">
import type { Article } from '~/shared/api/contracts/article'

defineProps<{
    article: Pick<Article, 'slug'>
}>()
</script>
