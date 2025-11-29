<template>
    <div class="editor-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-10 offset-md-1 col-xs-12">
                    <!-- <ul class="error-messages">
                        <li>That title is required</li>
                    </ul> -->

                    <form>
                        <fieldset>
                            <fieldset class="form-group">
                                <input
                                    v-model="dto.title"
                                    type="text"
                                    class="form-control form-control-lg"
                                    placeholder="Article Title"
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    v-model="dto.description"
                                    type="text"
                                    class="form-control"
                                    placeholder="What's this article about?"
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea
                                    v-model="dto.body"
                                    class="form-control"
                                    rows="8"
                                    placeholder="Write your article (in markdown)"
                                ></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    v-model="newTag"
                                    type="text"
                                    class="form-control"
                                    placeholder="Enter tags"
                                    @keydown.enter="addTagToList"
                                />
                                <div class="tag-list">
                                    <span
                                        v-for="tag in dto.tagList"
                                        :key="tag"
                                        class="tag-default tag-pill"
                                    >
                                        <i class="ion-close-round"></i>
                                        {{ tag }}
                                    </span>
                                </div>
                            </fieldset>
                            <button
                                class="btn btn-lg pull-xs-right btn-primary"
                                type="button"
                            >
                                Publish Article
                            </button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { articleApi } from '~/shared/api/rest/article'

definePageMeta({
    roles: ['user'],
    middleware: 'auth-guard',
    props: true,
})

const props = defineProps<{
    slug: string
}>()

const newTag = ref('')
function addTagToList() {
    if (!newTag.value.trim()) {
        return
    }

    dto.value.tagList.push(newTag.value.trim())
    newTag.value = ''
}

const { data: articleData, suspense: articleSuspense } = useQuery({
    queryKey: ['article', props.slug],
    queryFn: () => articleApi.getBySlug({ slug: props.slug }),
})
onServerPrefetch(articleSuspense)

type EditArticleDto = {
    title: string
    description: string
    body: string
    tagList: string[]
}
const dto = ref<EditArticleDto>({
    title: '',
    description: '',
    body: '',
    tagList: [],
})
watch(
    articleData,
    newVal => {
        console.log('newVal', newVal)
        if (newVal) {
            dto.value.title = newVal.article.title
            dto.value.description = newVal.article.description
            dto.value.body = newVal.article.body
            dto.value.tagList = [...newVal.article.tagList]
        }
    },
    {
        immediate: true,
    }
)
</script>
