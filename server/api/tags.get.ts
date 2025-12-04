import { articleService } from '../services'

export default defineEventHandler(async _event => {
    const tags = await articleService.getAllTags()

    return {
        tags,
    }
})
