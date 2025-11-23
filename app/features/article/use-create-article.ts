import { useMutation } from '@tanstack/vue-query'
import { articleApi } from '~/shared/api/rest/article'

type CreateArticleDto = {
    title: string
    description: string
    body: string
    tagList: string[]
}

export const useCreateArticle = () => {
    const dto = ref<CreateArticleDto>({
        title: '',
        description: '',
        body: '',
        tagList: [],
    })

    const { mutateAsync: createArticle } = useMutation({
        mutationKey: ['create-article'],
        mutationFn: articleApi.create,
    })

    const create = async () => {
        const result = await createArticle({
            title: dto.value.title,
            description: dto.value.description,
            body: dto.value.body,
            tagList: dto.value.tagList,
        })

        return result
    }

    return { dto, create }
}
