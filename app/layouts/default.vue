<template>
    <AppHeader />
    <slot></slot>
    <AppFooter />
</template>

<script setup lang="ts">
import AppHeader from '~/widgets/AppHeader.vue'
import AppFooter from '~/widgets/AppFooter.vue'
</script>
