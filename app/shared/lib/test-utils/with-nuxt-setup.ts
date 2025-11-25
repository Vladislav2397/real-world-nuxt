import { mountSuspended } from '@nuxt/test-utils/runtime'

export async function withNuxtSetup<T>(useFn: () => T): Promise<T> {
    let result!: T

    const Comp = defineComponent({
        setup() {
            result = useFn()
            return () => null
        },
    })

    await mountSuspended(Comp)
    return result
}
