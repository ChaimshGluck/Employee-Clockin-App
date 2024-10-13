export function handleError(message, error) {
    console.error(message, error);

    if (typeof error == 'string') {
        return { ok: false, message: error }
    }
    return { ok: false, message: error.message };
}