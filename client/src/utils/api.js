const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const fetchFromBackend = async (endpoint, credentials = 'same-origin', method = 'GET', body = null, headers = {}) => {
    try {
        const response = await fetch(`${backendUrl}${endpoint}`, {
            method: method,
            credentials: credentials,
            body: body ? JSON.stringify(body) : null,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        });

        // If response is not ok, throw an error
        if (!response.ok) {
            const error = await response.json();
            throw new Error(JSON.stringify(error));
        }

        // If response is JSON, return JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        // Otherwise, return response as text
        return response;
    } catch (error) {
        console.error('Error fetching from backend:', error.message);

        // Try to parse error message and return it
        let parsedError;
        try {
            parsedError = JSON.parse(error.message);
        } catch (parseError) {
            parsedError = { message: error.message };
        }
        console.error('Parsed error:', parsedError);
        return parsedError;
    }
};