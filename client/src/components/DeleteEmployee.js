import { useContext } from "react";
import { UserContext } from "../App";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const deleteEmployee = async (onToggle) => {
    const employeeId = useContext(UserContext);
    try {
        const response = await fetch(`${backendUrl}/hr/register?employeeId=${employeeId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
        })
        const result = await response.json();
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