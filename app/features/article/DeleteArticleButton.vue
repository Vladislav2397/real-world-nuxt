<template>
    <button class="btn btn-sm btn-outline-danger" @click="onClick">
        <i class="ion-trash-a"></i> Delete Article
    </button>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Article } from '~/shared/api/contracts/article'
import { articleListQueryOptions } from '~/shared/api/query-options/article'

const { article } = defineProps<{
    article: Pick<Article, 'slug'>
}>()

const queryClient = useQueryClient()
const httpClient = useHttpClient()
const deleteArticleMutation = useMutation({
    mutationKey: ['delete-article'],
    mutationFn: () =>
        httpClient(`/api/articles/${article.slug}` as '/api/articles/:slug', {
            method: 'DELETE',
        }),
    onSuccess: async () => {
        await queryClient.invalidateQueries(articleListQueryOptions())
    },
})

const emit = defineEmits<{
    deleted: []
}>()

async function onClick() {
    await deleteArticleMutation.mutateAsync()

    emit('deleted')
}
</script>
