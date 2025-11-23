<template>
    <button class="btn btn-outline-danger" @click="handleLogout">
        Or click here to logout.
    </button>
</template>

<script setup lang="ts">
import { useLogout } from './use-logout'

const { handleLogout } = useLogout()
</script>
