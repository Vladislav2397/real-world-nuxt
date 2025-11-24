<template>
    <div class="auth-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">Sign in</h1>
                    <p class="text-xs-center">
                        <NuxtLink to="/register">Need an account?</NuxtLink>
                    </p>

                    <LoginForm />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import LoginForm from '~/features/auth/LoginForm.vue'

definePageMeta({
    roles: ['guest'],
    middleware: 'auth-guard',
})
</script>
