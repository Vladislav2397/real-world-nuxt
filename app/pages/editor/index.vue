<template>
    <div class="editor-page">
        <div class="container page">
            <div class="row">
                <CreateArticleForm />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CreateArticleForm from '~/features/article/CreateArticleForm.vue'

definePageMeta({
    roles: ['user'],
    middleware: 'auth-guard',
})
</script>
