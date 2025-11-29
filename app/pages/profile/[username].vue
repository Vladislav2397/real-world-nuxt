<template>
    <div class="profile-page">
        <div v-if="user" class="user-info">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-md-10 offset-md-1">
                        <img
                            :src="
                                user.image ||
                                'https://raw.githubusercontent.com/gothinkster/node-express-realworld-example-app/refs/heads/master/src/assets/images/smiley-cyrus.jpeg'
                            "
                            class="user-img"
                        />
                        <h4>{{ user.username }}</h4>
                        <p>
                            {{ user.bio }}
                        </p>
                        <button
                            v-if="!isViewerProfile"
                            class="btn btn-sm btn-outline-secondary action-btn"
                        >
                            <i class="ion-plus-round"></i>
                            &nbsp; Follow {{ user.username }}
                        </button>
                        <NuxtLink
                            v-else
                            class="btn btn-sm btn-outline-secondary action-btn"
                            to="/settings"
                        >
                            <i class="ion-gear-a"></i>
                            &nbsp; Edit Profile Settings
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row">
                <div class="col-xs-12 col-md-10 offset-md-1">
                    <div class="articles-toggle">
                        <ul class="nav nav-pills outline-active">
                            <li class="nav-item">
                                <a class="nav-link active" href=""
                                    >My Articles</a
                                >
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href=""
                                    >Favorited Articles</a
                                >
                            </li>
                        </ul>
                    </div>

                    <Article
                        v-for="article in articles"
                        :key="article.slug"
                        :article="article"
                    />

                    <ul class="pagination">
                        <li class="page-item active">
                            <a class="page-link" href="">1</a>
                        </li>
                        <li class="page-item">
                            <a class="page-link" href="">2</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { articleApi } from '~/shared/api/rest/article'
import { profileApi } from '~/shared/api/rest/profile'

definePageMeta({
    props: true,
})

const props = defineProps<{
    username: string
}>()

const isViewerProfile = computed(() => true)

const { data: userData, suspense: userSuspense } = useQuery({
    queryKey: ['user', props.username],
    queryFn: () => profileApi.getByUsername({ username: props.username }),
})
onServerPrefetch(userSuspense)
const user = computed(() => userData.value?.profile ?? null)

const { data: articlesData, suspense: articlesSuspense } = useQuery({
    queryKey: ['articles', props.username],
    queryFn: () => articleApi.getList({ author: props.username }),
})
onServerPrefetch(articlesSuspense)
const articles = computed(() => articlesData.value?.articles ?? null)
</script>
