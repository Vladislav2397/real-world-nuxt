<template>
    <nav v-if="!isAuthenticated" class="navbar navbar-light">
        <div class="container">
            <NuxtLink class="navbar-brand" to="/">conduit</NuxtLink>
            <ul class="nav navbar-nav pull-xs-right">
                <li class="nav-item">
                    <!-- Add "active" class when you're on that page" -->
                    <NuxtLink class="nav-link" active-class="active" to="/"
                        >Home</NuxtLink
                    >
                </li>
                <li class="nav-item">
                    <NuxtLink class="nav-link" active-class="active" to="/login"
                        >Sign in</NuxtLink
                    >
                </li>
                <li class="nav-item">
                    <NuxtLink
                        class="nav-link"
                        active-class="active"
                        to="/register"
                    >
                        Sign up
                    </NuxtLink>
                </li>
            </ul>
        </div>
    </nav>
    <nav v-else class="navbar navbar-light">
        <div class="container">
            <NuxtLink class="navbar-brand" to="/">conduit</NuxtLink>
            <ul class="nav navbar-nav pull-xs-right">
                <li class="nav-item">
                    <!-- Add "active" class when you're on that page" -->
                    <NuxtLink class="nav-link" active-class="active" to="/"
                        >Home</NuxtLink
                    >
                </li>
                <li class="nav-item">
                    <NuxtLink
                        class="nav-link"
                        active-class="active"
                        to="/editor"
                    >
                        <i class="ion-compose"></i>&nbsp;New Article
                    </NuxtLink>
                </li>
                <li class="nav-item">
                    <NuxtLink
                        class="nav-link"
                        active-class="active"
                        to="/settings"
                    >
                        <i class="ion-gear-a"></i>&nbsp;Settings
                    </NuxtLink>
                </li>
                <li class="nav-item">
                    <NuxtLink
                        class="nav-link"
                        active-class="active"
                        to="/profile/eric-simons"
                    >
                        <img src="" class="user-pic" />
                        Eric Simons
                    </NuxtLink>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script setup lang="ts">
const token = useCookie('token', { default: () => '' })
const isAuthenticated = computed(() => !!token.value)
</script>
