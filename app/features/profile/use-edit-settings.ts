import { useQuery } from '@tanstack/vue-query'
import { profileApi } from '~/shared/api/rest/profile'

export const useEditSettings = () => {
    const { data: userData, suspense: userSuspense } = useQuery({
        queryKey: ['user'],
        queryFn: () => profileApi.getByUsername({ username: 'jake' }),
    })
    const user = computed(() => userData.value?.profile ?? null)

    type UpdateUserDto = {
        image: string
        username: string
        bio: string
        email: string
        password: string
    }
    const dto = ref<UpdateUserDto>({
        image: '',
        username: '',
        bio: '',
        email: '',
        password: '',
    })
    watch(
        user,
        newVal => {
            if (newVal) {
                dto.value.image = newVal.image
                dto.value.username = newVal.username
                dto.value.bio = newVal.bio
                // dto.value.email = newVal.email
                // dto.value.password = newVal.password
            }
        },
        {
            immediate: true,
        }
    )

    function handleSubmit(e: Event) {
        const formData = new FormData(e.target as HTMLFormElement)
        const image = formData.get('image') as string
        const username = formData.get('username') as string
        const bio = formData.get('bio') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        console.log({ image, username, bio, email, password })
    }

    return { userSuspense, dto, handleSubmit }
}
