<template>
    <button class="btn btn-sm btn-outline-danger">
        <i class="ion-trash-a"></i> Delete Article
    </button>
</template>

<script setup lang="ts">
import type { Article } from '~/shared/api/contracts/article'

defineProps<{
    article: Pick<Article, 'slug'>
}>()
</script>
