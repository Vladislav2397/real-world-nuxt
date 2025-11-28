<template>
    <button
        class="btn btn-outline-primary btn-sm pull-xs-right"
        @click="toggle">
        <i :class="article.favorited ? 'ion-heart-broken' : 'ion-heart'"></i>
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
import type { Article } from '~/shared/api/contracts/article'
import { useToggleFavorite } from './use-toggle-favorite'

const { article } = defineProps<{
    article: Pick<Article, 'slug' | 'favoritesCount' | 'favorited'>
}>()

// Это сделано для того что бы не терять реактивность для useToggleFavorite
//  очень странно что он теряет реактивность
const data = computed(() => article)

const { toggle } = useToggleFavorite(data)
</script>
