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
                            <li
                                v-for="tab in tabs"
                                :key="tab.name"
                                :class="['nav-item']"
                            >
                                <NuxtLink
                                    :class="[
                                        'nav-link',
                                        tab.isActive && 'active',
                                    ]"
                                    :to="tab.route"
                                >
                                    {{ tab.name }}
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
import { onServerPrefetch } from 'vue'
import { useRouteQuery } from '@vueuse/router'
import { useQuery } from '@tanstack/vue-query'
import ToggleFavoriteButton from '~/features/article/ToggleFavoriteButton.vue'
import {
    articleListQueryOptions,
    tagListQueryOptions,
} from '~/shared/api/query-options/article'

const pages = computed(() => [1, 2])
const currentPage = useRouteQuery('page', '1')

const currentType = useRouteQuery('type', 'global')

const tabs = computed(() => {
    const arr = []

    if (isAuthorized.value) {
        arr.push({
            name: 'Your Feed',
            isActive: false,
            route: { query: { type: 'feed' } },
        })
    }

    arr.push({
        name: 'Global Feed',
        isActive: !currentTag.value,
        route: { query: { type: 'global' } },
    })

    if (currentTag.value) {
        arr.push({
            name: currentTag.value,
            route: { query: { type: 'tag', tag: currentTag.value } },
            isActive: true,
        })
    }

    return arr
})

const currentTag = useRouteQuery('tag', '')

const token = useCookie('token', { default: () => '' })
const isAuthorized = computed(() => !!token.value)

const { data: articlesData, suspense: articlesSuspense } = useQuery(
    articleListQueryOptions()
)
const articles = computed(() => articlesData.value?.articles ?? [])

const { data: tagsData, suspense: tagsSuspense } = useQuery(
    tagListQueryOptions()
)
const tags = computed(() => tagsData.value?.tags ?? [])

onServerPrefetch(async () => {
    await articlesSuspense()
    await tagsSuspense()
})
</script>
