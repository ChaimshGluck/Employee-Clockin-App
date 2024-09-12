export function handleError(message, error) {
    console.error(message, error);

    if (typeof error == 'string') {
        return { ok: false, error: error}
    }
    return { ok: false, error: error.message };
}