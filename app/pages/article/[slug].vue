<template>
    <div v-if="article" class="article-page">
        <div class="banner">
            <div class="container">
                <h1>{{ article.title }}</h1>

                <div class="article-meta">
                    <a :href="`/profile/${article.author.username}`"
                        ><img
                            :src="
                                article.author.image ??
                                'https://raw.githubusercontent.com/gothinkster/node-express-realworld-example-app/refs/heads/master/src/assets/images/smiley-cyrus.jpeg'
                            "
                    /></a>
                    <div class="info">
                        <a
                            :href="`/profile/${article.author.username}`"
                            class="author"
                        >
                            {{ article.author.username }}
                        </a>
                        <span class="date">{{
                            dayjs(article.createdAt).format('MMMM D') + 'th'
                        }}</span>
                    </div>
                    <button class="btn btn-sm btn-outline-secondary">
                        <i class="ion-plus-round"></i>
                        &nbsp; Follow {{ article.author.username }}
                        <span class="counter"
                            >({{ article.favoritesCount }})</span
                        >
                    </button>
                    &nbsp;&nbsp;
                    <ToggleFavoriteButton
                        :article="article"
                        text="Favorite Article"
                    >
                        &nbsp; Favorite Post
                        <span class="counter">
                            ({{ article.favoritesCount }})
                        </span>
                    </ToggleFavoriteButton>
                    <EditArticleButton :article="article" />
                    <DeleteArticleButton
                        :article="article"
                        @deleted="onDeleted"
                    />
                </div>
            </div>
        </div>

        <div class="container page">
            <div class="row article-content">
                <div class="col-md-12">
                    <div v-html="article.body"></div>
                    <ul class="tag-list">
                        <li
                            v-for="tag in article.tagList"
                            :key="tag"
                            class="tag-default tag-pill tag-outline"
                        >
                            {{ tag }}
                        </li>
                    </ul>
                </div>
            </div>

            <hr />

            <div class="article-actions">
                <div class="article-meta">
                    <a :href="`/profile/${article.author.username}`"
                        ><img
                            :src="
                                article.author.image ??
                                'https://raw.githubusercontent.com/gothinkster/node-express-realworld-example-app/refs/heads/master/src/assets/images/smiley-cyrus.jpeg'
                            "
                    /></a>
                    <div class="info">
                        <a
                            :href="`/profile/${article.author.username}`"
                            class="author"
                        >
                            {{ article.author.username }}
                        </a>
                        <span class="date">{{ article.createdAt }}</span>
                    </div>

                    <button class="btn btn-sm btn-outline-secondary">
                        <i class="ion-plus-round"></i>
                        &nbsp; Follow {{ article.author.username }}
                    </button>
                    &nbsp;
                    <ToggleFavoriteButton :article="article">
                        &nbsp; Favorite Article
                        <span class="counter">
                            ({{ article.favoritesCount }})
                        </span>
                    </ToggleFavoriteButton>
                    <EditArticleButton :article="article" />
                    <DeleteArticleButton
                        :article="article"
                        @deleted="onDeleted"
                    />
                </div>
            </div>

            <div class="row">
                <div class="col-xs-12 col-md-8 offset-md-2">
                    <form class="card comment-form">
                        <div class="card-block">
                            <textarea
                                class="form-control"
                                placeholder="Write a comment..."
                                rows="3"
                            ></textarea>
                        </div>
                        <div class="card-footer">
                            <img
                                src="http://i.imgur.com/Qr71crq.jpg"
                                class="comment-author-img"
                            />
                            <button class="btn btn-sm btn-primary">
                                Post Comment
                            </button>
                        </div>
                    </form>

                    <Comment
                        v-for="comment in comments"
                        :key="comment.id"
                        :comment="comment"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import DeleteArticleButton from '~/features/article/DeleteArticleButton.vue'
import EditArticleButton from '~/features/article/EditArticleButton.vue'
import ToggleFavoriteButton from '~/features/article/ToggleFavoriteButton.vue'
import {
    articleBySlugQueryOptions,
    commentListQueryOptions,
} from '~/shared/api/query-options/article'
import dayjs from 'dayjs'

definePageMeta({
    props: true,
})
const props = defineProps<{
    slug: string
}>()
const params = computed(() => ({
    slug: props.slug,
}))

const { data: articleData, suspense: articleSuspense } = useQuery(
    articleBySlugQueryOptions(params)
)
const article = computed(() => articleData.value?.article ?? null)

const { data: commentsData, suspense: commentsSuspense } = useQuery(
    commentListQueryOptions(params)
)
const comments = computed(() => commentsData.value?.comments ?? null)

function onDeleted() {
    navigateTo('/')
}

onServerPrefetch(async () => {
    await articleSuspense()
    await commentsSuspense()
})
</script>
