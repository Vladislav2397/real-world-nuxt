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
                    <LogoutButton />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import LogoutButton from '~/features/auth/LogoutButton.vue'
import { useEditSettings } from '~/features/profile/use-edit-settings'

definePageMeta({
    roles: ['user'],
    middleware: 'auth-guard',
})

const { userSuspense, dto, handleSubmit } = useEditSettings()
onServerPrefetch(userSuspense)
</script>
