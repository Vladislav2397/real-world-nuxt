<template>
    <button
        class="btn btn-outline-primary btn-sm pull-xs-right"
        @click="toggle"
    >
        <i class="ion-heart"></i> {{ article.favoritesCount }}
    </button>
</template>

<script setup lang="ts">
import type { Article } from '~/shared/api/contracts/article'
import { useToggleFavorite } from './use-toggle-favorite'

const { article } = defineProps<{
    article: Pick<Article, 'slug' | 'favoritesCount' | 'favorited'>
}>()

const { toggle } = useToggleFavorite(article)
</script>
