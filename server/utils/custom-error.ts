export const createCustomError = (
    event: any,
    statusCode: number,
    data: any
) => {
    setResponseStatus(event, statusCode)
    return data
}
