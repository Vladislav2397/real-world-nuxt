<template>
    <button class="btn btn-outline-primary btn-sm pull-xs-right">
        <i class="ion-heart"></i> {{ article.favoritesCount }}
    </button>
</template>

<script setup lang="ts">
import type { Article } from '~/shared/api/contracts/article'

defineProps<{
    article: Pick<Article, 'favoritesCount' | 'favorited'>
}>()
</script>
