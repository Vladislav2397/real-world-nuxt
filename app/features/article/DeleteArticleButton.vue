<template>
    <button class="btn btn-sm btn-outline-danger" @click="onClick">
        <i class="ion-trash-a"></i> Delete Article
    </button>
</template>

<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Article } from '~/shared/api/contracts/article'
import { articleListQueryOptions } from '~/shared/api/query-options/article'
import { articleApi } from '~/shared/api/rest/article'

const queryClient = useQueryClient()
const deleteArticleMutation = useMutation({
    mutationKey: ['deleteArticle'],
    mutationFn: articleApi.delete,
    onSuccess: async () => {
        await queryClient.invalidateQueries(articleListQueryOptions())
    },
})

const { article } = defineProps<{
    article: Pick<Article, 'slug'>
}>()

const emit = defineEmits<{
    deleted: []
}>()

function onClick() {
    deleteArticleMutation.mutate({
        slug: article.slug,
    })

    emit('deleted')
}
</script>
