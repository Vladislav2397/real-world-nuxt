<template>
    <div class="auth-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">Sign in</h1>
                    <p class="text-xs-center">
                        <NuxtLink to="/register">Need an account?</NuxtLink>
                    </p>

                    <!-- <ul class="error-messages">
                        <li>That email is already taken</li>
                    </ul> -->

                    <form @submit.prevent="handleSubmit">
                        <fieldset class="form-group">
                            <input
                                class="form-control form-control-lg"
                                name="email"
                                type="email"
                                placeholder="Email"
                            />
                        </fieldset>
                        <fieldset class="form-group">
                            <input
                                class="form-control form-control-lg"
                                name="password"
                                type="password"
                                minlength="8"
                                required
                                placeholder="Password"
                            />
                        </fieldset>
                        <button class="btn btn-lg btn-primary pull-xs-right">
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { navigateTo } from '#app'
import { useMutation } from '@tanstack/vue-query'
import { authApi } from '~/shared/api/rest/auth'

definePageMeta({
    roles: ['guest'],
    middleware: 'auth-guard',
})

const { mutateAsync: login } = useMutation({
    mutationKey: ['login'],
    mutationFn: authApi.login,
})

const token = useCookie('token', { default: () => '' })

async function handleSubmit(e: Event) {
    const formData = new FormData(e.target as HTMLFormElement)

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await login({ email, password })

    token.value = result.user.token

    navigateTo('/')
}
</script>
