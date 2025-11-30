import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { authApi } from '~/shared/api/rest/auth'
import { getCurrentUserQueryOptions } from '~/shared/api/query-options/auth'

export const useEditSettings = () => {
    const queryClient = useQueryClient()
    const { data: userData, suspense: userSuspense } = useQuery(
        getCurrentUserQueryOptions()
    )
    const user = computed(() => userData.value?.user ?? null)

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
                dto.value.image = newVal.image ?? ''
                dto.value.username = newVal.username ?? ''
                dto.value.bio = newVal.bio ?? ''
                dto.value.email = newVal.email ?? ''
                // password не заполняем, так как это новое поле
            }
        },
        {
            immediate: true,
        }
    )

    const { mutateAsync: updateUser } = useMutation({
        mutationKey: ['update-user'],
        mutationFn: () =>
            authApi.updateUser({
                image: dto.value.image,
                username: dto.value.username,
                bio: dto.value.bio,
                email: dto.value.email,
                password: dto.value.password || undefined,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries(getCurrentUserQueryOptions())
        },
    })

    async function handleSubmit() {
        await updateUser()
    }

    return { userSuspense, dto, handleSubmit }
}
