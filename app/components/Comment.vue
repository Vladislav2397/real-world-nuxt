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
                <img
                    :src="
                        comment.author.image ??
                        'https://raw.githubusercontent.com/gothinkster/node-express-realworld-example-app/refs/heads/master/src/assets/images/smiley-cyrus.jpeg'
                    "
                    class="comment-author-img"
                />
            </NuxtLink>
            &nbsp;
            <NuxtLink
                :to="`/profile/${comment.author.username}`"
                class="comment-author"
                >{{ comment.author.username }}</NuxtLink
            >
            <span class="date-posted">{{
                dayjs(comment.createdAt).format('MMMM D') + 'th'
            }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/shared/api/contracts/article'
import dayjs from 'dayjs'

defineProps<{
    comment: Comment
}>()
</script>
