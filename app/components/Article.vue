<template>
    <div class="article-preview">
        <div class="article-meta">
            <NuxtLink :to="`/profile/${article.author.username}`">
                <img
                    :src="
                        article.author.image ||
                        'https://raw.githubusercontent.com/gothinkster/node-express-realworld-example-app/refs/heads/master/src/assets/images/smiley-cyrus.jpeg'
                    "
                />
            </NuxtLink>
            <div class="info">
                <NuxtLink
                    :to="`/profile/${article.author.username}`"
                    class="author"
                >
                    {{ article.author.username }}
                </NuxtLink>
                <span class="date">{{
                    dayjs(article.createdAt).format('MMMM D') + 'th'
                }}</span>
            </div>
            <slot name="favorite-action"></slot>
        </div>
        <NuxtLink :to="`/article/${article.slug}`" class="preview-link">
            <h1>{{ article.title }}</h1>
            <p>{{ article.description }}</p>
            <span>Read more...</span>
            <ul class="tag-list">
                <li
                    v-for="tag in article.tagList"
                    :key="tag"
                    class="tag-default tag-pill tag-outline"
                >
                    {{ tag }}
                </li>
            </ul>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import type { Article } from '~/shared/api/contracts/article'
import dayjs from 'dayjs'

defineProps<{
    article: Article
}>()
</script>
