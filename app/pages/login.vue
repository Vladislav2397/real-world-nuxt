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
import { useLogin } from '~/features/auth/use-login'

definePageMeta({
    roles: ['guest'],
    middleware: 'auth-guard',
})

const { handleSubmit } = useLogin()
</script>
