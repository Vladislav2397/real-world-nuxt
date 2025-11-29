<template>
    <div class="col-md-10 offset-md-1 col-xs-12">
        <!-- <ul class="error-messages">
            <li>That title is required</li>
        </ul> -->

        <form>
            <fieldset>
                <fieldset class="form-group">
                    <input
                        v-model="dto.title"
                        name="title"
                        type="text"
                        class="form-control form-control-lg"
                        placeholder="Article Title"
                    />
                </fieldset>
                <fieldset class="form-group">
                    <input
                        v-model="dto.description"
                        name="description"
                        type="text"
                        class="form-control"
                        placeholder="What's this article about?"
                    />
                </fieldset>
                <fieldset class="form-group">
                    <textarea
                        v-model="dto.body"
                        name="body"
                        class="form-control"
                        rows="8"
                        placeholder="Write your article (in markdown)"
                    ></textarea>
                </fieldset>
                <fieldset class="form-group">
                    <input
                        v-model="newTag"
                        name="tag"
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
                    @click="handleSubmit"
                >
                    Publish Article
                </button>
            </fieldset>
        </form>
    </div>
</template>

<script setup lang="ts">
import { useCreateArticle } from './use-create-article'

const { dto, create } = useCreateArticle()

const emit = defineEmits<{
    (e: 'created'): void
}>()

async function handleSubmit() {
    await create()
    emit('created')
}

const newTag = ref('')
function addTagToList() {
    if (!newTag.value.trim()) {
        return
    }

    dto.value.tagList.push(newTag.value.trim())
    newTag.value = ''
}
</script>
