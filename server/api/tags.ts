import { getAllTags } from '../utils/articles'

export default defineEventHandler(_event => {
    const tags = getAllTags()

    return {
        tags,
    }
})
