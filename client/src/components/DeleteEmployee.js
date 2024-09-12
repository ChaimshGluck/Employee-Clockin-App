const backendUrl = process.env.REACT_APP_BACKEND_URL;

const deleteEmployee = async (onToggle, employeeId) => {
    try {
        const response = await fetch(`${backendUrl}/hr/delete?employeeId=${employeeId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
        })
        const result = await response.json();
        console.log()
        if (result.ok) {
            alert('Employee deleted');
            onToggle('Employees');
        } else {
            alert(result.error)
        }
    } catch (error) {
        alert('Error deleting employee');
    }
};

export default deleteEmployee;