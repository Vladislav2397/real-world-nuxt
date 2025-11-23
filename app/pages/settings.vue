<template>
    <div class="settings-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">Your Settings</h1>

                    <!-- <ul class="error-messages">
                        <li>That name is required</li>
                    </ul> -->

                    <form @submit.prevent="handleSubmit">
                        <fieldset>
                            <fieldset class="form-group">
                                <input
                                    v-model="dto.image"
                                    name="image"
                                    class="form-control"
                                    type="text"
                                    placeholder="URL of profile picture"
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    v-model="dto.username"
                                    name="username"
                                    class="form-control form-control-lg"
                                    type="text"
                                    placeholder="Your Name"
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea
                                    v-model="dto.bio"
                                    name="bio"
                                    class="form-control form-control-lg"
                                    rows="8"
                                    placeholder="Short bio about you"
                                ></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    v-model="dto.email"
                                    name="email"
                                    class="form-control form-control-lg"
                                    type="text"
                                    placeholder="Email"
                                />
                            </fieldset>
                            <fieldset class="form-group">
                                <input
                                    v-model="dto.password"
                                    name="password"
                                    class="form-control form-control-lg"
                                    type="password"
                                    placeholder="New Password"
                                />
                            </fieldset>
                            <button
                                class="btn btn-lg btn-primary pull-xs-right"
                            >
                                Update Settings
                            </button>
                        </fieldset>
                    </form>
                    <hr />
                    <button
                        class="btn btn-outline-danger"
                        @click="handleLogout"
                    >
                        Or click here to logout.
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { profileApi } from '~/shared/api/rest/profile'

definePageMeta({
    roles: ['user'],
    middleware: 'auth-guard',
})

const { data: userData, suspense: userSuspense } = useQuery({
    queryKey: ['user'],
    queryFn: () => profileApi.getByUsername({ username: 'jake' }),
})
onServerPrefetch(userSuspense)
const user = computed(() => userData.value?.profile ?? null)

type UpdateUserDto = {
    image: string
    username: string
    bio: string
    email: string
    password: string
}
const dto = ref<UpdateUserDto>({
    image: '',
    username: '',
    bio: '',
    email: '',
    password: '',
})
watch(
    user,
    newVal => {
        if (newVal) {
            dto.value.image = newVal.image
            dto.value.username = newVal.username
            dto.value.bio = newVal.bio
            // dto.value.email = newVal.email
            // dto.value.password = newVal.password
        }
    },
    {
        immediate: true,
    }
)

function handleSubmit(e: Event) {
    const formData = new FormData(e.target as HTMLFormElement)
    const image = formData.get('image') as string
    const username = formData.get('username') as string
    const bio = formData.get('bio') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log({ image, username, bio, email, password })
}

const token = useCookie('token', { default: () => '' })
function handleLogout() {
    token.value = ''
    navigateTo('/login')
}
</script>
