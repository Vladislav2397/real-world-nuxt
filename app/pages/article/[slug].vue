<template>
    <div v-if="article" class="article-page">
        <div class="banner">
            <div class="container">
                <h1>{{ article.title }}</h1>

                <div class="article-meta">
                    <a :href="`/profile/${article.author.username}`"
                        ><img :src="article.author.image"
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
                        <span class="counter"
                            >({{ article.favoritesCount }})</span
                        >
                    </button>
                    &nbsp;&nbsp;
                    <button
                        class="btn btn-sm btn-outline-primary"
                        @click="toggleFavorite"
                    >
                        <i class="ion-heart"></i>
                        &nbsp; Favorite Post
                        <span class="counter"
                            >({{ article.favoritesCount }})</span
                        >
                    </button>
                    <EditArticleButton :article="article" />
                    <button class="btn btn-sm btn-outline-danger">
                        <i class="ion-trash-a"></i> Delete Article
                    </button>
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
                        ><img :src="article.author.image"
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
                    <button
                        class="btn btn-sm btn-outline-primary"
                        @click="toggleFavorite"
                    >
                        <i class="ion-heart"></i>
                        &nbsp; Favorite Article
                        <span class="counter"
                            >({{ article.favoritesCount }})</span
                        >
                    </button>
                    <EditArticleButton :article="article" />
                    <DeleteArticleButton :article="article" />
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
import { useToggleFavorite } from '~/features/article/use-toggle-favorite'
import { articleApi } from '~/shared/api/rest/article'

const props = defineProps<{
    slug: string
}>()

const { data: articleData, suspense: articleSuspense } = useQuery({
    queryKey: ['article', props.slug],
    queryFn: () => articleApi.getBySlug({ slug: props.slug }),
})
onServerPrefetch(articleSuspense)
const article = computed(() => articleData.value?.article ?? null)

const { data: commentsData, suspense: commentsSuspense } = useQuery({
    queryKey: ['comments', props.slug],
    queryFn: () => articleApi.getComments({ slug: props.slug }),
})
onServerPrefetch(commentsSuspense)
const comments = computed(() => commentsData.value?.comments ?? null)

const { toggle: toggleFavorite } = useToggleFavorite(article.value)
</script>
