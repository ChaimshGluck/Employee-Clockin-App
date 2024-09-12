export function handleError(message, error) {
    console.error(message, error);

    if (error == 'Email already in use') {
        return { ok: false, error: error}
    }
    return { ok: false, error: error.message };
}