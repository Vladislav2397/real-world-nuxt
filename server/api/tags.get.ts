import { articleService } from '../services'

export default defineEventHandler(_event => {
    const tags = articleService.getAllTags()

    return {
        tags,
    }
})
