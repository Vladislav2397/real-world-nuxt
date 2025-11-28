import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    compatibilityDate: '2025-07-15',

    modules: ['@nuxt/eslint', '@nuxt/test-utils/module'],
    devServer: {
        port: 5910,
    },
    app: {
        head: {
            title: 'Conduit',
            htmlAttrs: {
                lang: 'en',
            },
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                {
                    rel: 'stylesheet',
                    type: 'text/css',
                    href: '//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css',
                },
                {
                    rel: 'stylesheet',
                    type: 'text/css',
                    href: '//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic',
                },
            ],
        },
    },
    eslint: {
        config: {
            stylistic: false,
        },
    },
})
