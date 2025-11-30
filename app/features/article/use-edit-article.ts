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

    const dto = ref<EditArticleDto>({
        title: '',
        description: '',
        body: '',
        tagList: [],
    })
    watch(articleData, newVal => {
        if (newVal) {
            dto.value.title = newVal.article.title
            dto.value.description = newVal.article.description
            dto.value.body = newVal.article.body
            dto.value.tagList = newVal.article.tagList
        }
    })
    const httpClient = useHttpClient()
    const { mutateAsync: editArticle } = useMutation({
        mutationKey: ['edit-article', slug],
        mutationFn: () =>
            httpClient(`/api/articles/${slug}` as '/api/articles/:slug', {
                method: 'PUT',
                body: {
                    article: dto.value,
                },
            }),
    })

    const handleSubmit = async () => {
        const result = await editArticle()

        console.log(result)
    }

    return { articleSuspense, dto, handleSubmit }
}
