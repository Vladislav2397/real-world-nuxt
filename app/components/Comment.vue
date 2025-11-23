<template>
    <div class="card">
        <div class="card-block">
            <p class="card-text">
                {{ comment.body }}
            </p>
        </div>
        <div class="card-footer">
            <NuxtLink
                :to="`/profile/${comment.author.username}`"
                class="comment-author"
            >
                <img :src="comment.author.image" class="comment-author-img" />
            </NuxtLink>
            &nbsp;
            <NuxtLink
                :to="`/profile/${comment.author.username}`"
                class="comment-author"
                >{{ comment.author.username }}</NuxtLink
            >
            <span class="date-posted">{{ comment.createdAt }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/shared/api/contracts/article'

defineProps<{
    comment: Comment
}>()
</script>
