export function badRequest(message, details) {
    const e = new Error(message); e.status = 400; e.code = 'bad_request'; if (details) e.details = details; return e;
}
export function notFound(message) {
    const e = new Error(message); e.status = 404; e.code = 'not_found'; return e;
}
