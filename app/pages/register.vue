<template>
    <div class="auth-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">Sign up</h1>
                    <p class="text-xs-center">
                        <NuxtLink to="/login">Have an account?</NuxtLink>
                    </p>

                    <!-- <ul class="error-messages">
                        <li>That email is already taken</li>
                    </ul> -->

                    <form @submit.prevent="handleSubmit">
                        <fieldset class="form-group">
                            <input
                                class="form-control form-control-lg"
                                type="text"
                                placeholder="Username"
                            />
                        </fieldset>
                        <fieldset class="form-group">
                            <input
                                class="form-control form-control-lg"
                                type="text"
                                placeholder="Email"
                            />
                        </fieldset>
                        <fieldset class="form-group">
                            <input
                                class="form-control form-control-lg"
                                type="password"
                                placeholder="Password"
                            />
                        </fieldset>
                        <button class="btn btn-lg btn-primary pull-xs-right">
                            Sign up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { authApi } from '~/shared/api/rest/auth'

definePageMeta({
    roles: ['guest'],
    middleware: 'auth-guard',
})

const { mutateAsync: register } = useMutation({
    mutationKey: ['register'],
    mutationFn: authApi.register,
})

const token = useCookie('token', { default: () => '' })
async function handleSubmit(e: Event) {
    const formData = new FormData(e.target as HTMLFormElement)

    const username = formData.get('username') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await register({ username, email, password })

    token.value = result.user.token

    navigateTo('/')
}
</script>
