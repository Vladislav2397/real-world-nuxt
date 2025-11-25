<template>
    <ul class="error-messages">
        <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>

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
        <button class="btn btn-lg btn-primary pull-xs-right">Sign in</button>
    </form>
</template>

<script setup lang="ts">
import { useLogin } from './use-login'

const { login, errors } = useLogin()

async function handleSubmit(e: Event) {
    const formData = new FormData(e.target as HTMLFormElement)

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    await login({ email, password })

    navigateTo('/')
}
</script>
