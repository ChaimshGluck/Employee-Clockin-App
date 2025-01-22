function Logout() {
    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    }

    return (
        <p><button onClick={handleLogout}>Log Out</button></p>
    )
}

export default Logout;