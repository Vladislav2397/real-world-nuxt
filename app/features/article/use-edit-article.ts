import { useMutation, useQuery } from '@tanstack/vue-query'
import { articleApi } from '~/shared/api/rest/article'

type EditArticleDto = {
    title: string
    description: string
    body: string
    tagList: string[]
}

export const useEditArticle = (slug: string) => {
    const { data: articleData, suspense: articleSuspense } = useQuery({
        queryKey: ['article', slug],
        queryFn: () => articleApi.getBySlug({ slug }),
    })
    watch(articleData, newVal => {
        if (newVal) {
            dto.value.title = newVal.article.title
            dto.value.description = newVal.article.description
            dto.value.body = newVal.article.body
            dto.value.tagList = newVal.article.tagList
        }
    })

    const dto = ref<EditArticleDto>({
        title: '',
        description: '',
        body: '',
        tagList: [],
    })
    const { mutateAsync: editArticle } = useMutation({
        mutationKey: ['edit-article'],
        mutationFn: articleApi.edit,
    })

    const handleSubmit = async (e: Event) => {
        const formData = new FormData(e.target as HTMLFormElement)

        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const body = formData.get('body') as string
        const tagList = formData.get('tagList') as unknown as string[]

        const result = await editArticle({ title, description, body, tagList })

        console.log(result)
    }

    return { articleSuspense, dto, handleSubmit }
}
