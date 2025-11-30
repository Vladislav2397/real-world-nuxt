import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { articleApi } from '~/shared/api/rest/article'
import { articleListQueryOptions } from '~/shared/api/query-options/article'

type CreateArticleDto = {
    title: string
    description: string
    body: string
    tagList: string[]
}

export const useCreateArticle = () => {
    const queryClient = useQueryClient()

    const dto = ref<CreateArticleDto>({
        title: '',
        description: '',
        body: '',
        tagList: [],
    })

    const httpClient = useHttpClient()
    const { mutateAsync: createArticle } = useMutation({
        mutationKey: ['create-article'],
        mutationFn: () =>
            httpClient(`/api/articles` as '/api/articles', {
                method: 'POST',
                body: {
                    article: dto.value,
                },
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries(articleListQueryOptions())
        },
    })

    const create = async () => {
        const result = await createArticle()

        return result
    }

    return { dto, create }
}
