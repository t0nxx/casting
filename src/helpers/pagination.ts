export async function ApplyPagination(request, response, q, sendToClient: boolean) {
    let limit = 10;
    let page = 1;
    if (request.query.page) { page = parseInt(request.query.page, 10); }
    if (request.query.limit) { limit = parseInt(request.query.limit, 10); }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    q.take(limit);
    q.skip(startIndex);

    try {
        const [results, count] = await q.getManyAndCount();
        const responseObject: any = {};
        responseObject.results = results;
        responseObject.count = count;
        if (endIndex < count) {
            // responseObject.next = `${request.protocol}://${request.get('host')}${request.baseUrl}${request.path}?page=${page + 1}&limit=${limit}`;
            responseObject.next = `https://${request.get('host')}${request.baseUrl}${request.path}?page=${page + 1}&limit=${limit}`;

        }
        if (sendToClient == true) {
            return response.status(200).send({ ...responseObject });
        }
        return responseObject;
    } catch (error) {
        const err = error[0] ? Object.values(error[0].constraints) : [error.message];
        return response.status(400).send({ success: false, error: err });
    }
}
