export const tokenIsValid = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false
    };

    // Decode token and check if it's expired
    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return decodedToken.exp > currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return false;
    }
};