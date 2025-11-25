<template>
    <button class="btn btn-outline-danger" @click="onClickLogout">
        Or click here to logout.
    </button>
</template>

<script setup lang="ts">
import { useLogout } from './use-logout'

const { logout } = useLogout()

async function onClickLogout() {
    await logout()
    navigateTo('/')
}
</script>
