function Logout() {
    const handleLogout = () => {
        try {
            localStorage.clear();
            // setEmployeeId(null);
            // setFullName('');
            // changePage('LogIn');
            window.location.reload();
            alert('Logged out');
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    return (
        <p><button onClick={handleLogout}>Log out</button></p>
    )
}

export default Logout;