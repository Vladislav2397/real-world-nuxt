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

    const handleSubmit = async (e: Event) => {
        const formData = new FormData(e.target as HTMLFormElement)
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const body = formData.get('body') as string
        const tagList = formData.get('tagList') as unknown as string[]

        const result = await createArticle({
            title,
            description,
            body,
            tagList,
        })

        console.log(result)
    }

    return { dto, handleSubmit }
}
