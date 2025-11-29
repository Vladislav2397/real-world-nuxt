<template>
    <div class="home-page">
        <div class="banner">
            <div class="container">
                <h1 class="logo-font">conduit</h1>
                <p>A place to share your knowledge.</p>
            </div>
        </div>

        <div class="container page">
            <div class="row">
                <div class="col-md-9">
                    <div class="feed-toggle">
                        <ul class="nav nav-pills outline-active">
                            <li v-if="isAuthorized" class="nav-item">
                                <NuxtLink class="nav-link" to="/">
                                    Your Feed
                                </NuxtLink>
                            </li>
                            <li class="nav-item">
                                <NuxtLink class="nav-link active" to="/">
                                    Global Feed
                                </NuxtLink>
                            </li>
                            <li v-if="currentTag" class="nav-item">
                                <NuxtLink
                                    class="nav-link"
                                    :to="{ query: { tag: currentTag } }"
                                >
                                    {{ currentTag }}
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>

                    <Article
                        v-for="article in articles"
                        :key="article.slug"
                        :article="article"
                    >
                        <template #favorite-action>
                            <ToggleFavoriteButton :article="article">
                                &nbsp;{{ article.favoritesCount }}
                            </ToggleFavoriteButton>
                        </template>
                    </Article>

                    <ul class="pagination">
                        <li
                            v-for="page in pages"
                            :key="page"
                            :class="[
                                'page-item',
                                `${page}` === currentPage && 'active',
                            ]"
                        >
                            <NuxtLink
                                class="page-link"
                                :to="{ query: { page: `${page}` } }"
                            >
                                {{ page }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <div class="col-md-3">
                    <div class="sidebar">
                        <p>Popular Tags</p>

                        <div class="tag-list">
                            <NuxtLink
                                v-for="tag in tags"
                                :key="tag"
                                :to="{ query: { tag } }"
                                class="tag-pill tag-default"
                            >
                                {{ tag }}
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { articleApi } from '~/shared/api/rest/article'
import { onServerPrefetch } from 'vue'
import ToggleFavoriteButton from '~/features/article/ToggleFavoriteButton.vue'
import { articleListQueryOptions } from '~/shared/api/query-options/article'
import { useRouteQuery } from '@vueuse/router'

const pages = computed(() => [1, 2])
const currentPage = useRouteQuery('page', '1')

const currentTag = useRouteQuery('tag', '')

const token = useCookie('token', { default: () => '' })
const isAuthorized = computed(() => !!token.value)

const { data: articlesData, suspense: articlesSuspense } = useQuery(
    articleListQueryOptions()
)
const articles = computed(() => articlesData.value?.articles ?? [])

const { data: tagsData, suspense: tagsSuspense } = useQuery({
    queryKey: ['tag-list'],
    queryFn: articleApi.getTagList,
})
const tags = computed(() => tagsData.value?.tags ?? [])

onServerPrefetch(async () => {
    await articlesSuspense()
    await tagsSuspense()
})
</script>
