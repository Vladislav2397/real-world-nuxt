<template>
    <button class="btn btn-sm btn-outline-secondary action-btn">
        <i class="ion-plus-round"></i>
        &nbsp; Follow {{ profile.username }}
    </button>
</template>

<script setup lang="ts">
import type { Profile } from '~/shared/api/contracts/article'

defineProps<{
    profile: Pick<Profile, 'username' | 'following'>
}>()
</script>
