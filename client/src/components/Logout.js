function Logout() {
    const handleLogout = () => {
        try {
            localStorage.clear();
            window.location.reload();
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    return (
        <p><button onClick={handleLogout}>Log out</button></p>
    )
}

export default Logout;