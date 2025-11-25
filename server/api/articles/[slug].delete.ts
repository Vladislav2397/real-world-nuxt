export default defineEventHandler(_event => {
    setResponseStatus(_event, 204)
    return null
})

