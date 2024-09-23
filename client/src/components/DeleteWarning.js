import { useContext } from "react";
import { EmployeeContext } from "../App";
const backendUrl = process.env.REACT_APP_BACKEND_URL;


const DeleteWarning = ({ changePage, setShowDeleteBox, handleMessage }) => {
    const employeeId = useContext(EmployeeContext);

    const confirmDelete = async () => {
        setShowDeleteBox(false);
        try {
            const response = await fetch(`${backendUrl}/hr/delete?employeeIdToDelete=${employeeId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            })
            const result = await response.json();
            setShowDeleteBox(false);
            if (result.ok) {
                handleMessage('Employee Deleted', 'success');
                setTimeout(() => {
                    changePage('Employees')
                }, 4000);
            } else {
                handleMessage(result.error, 'error');
            }
        } catch (error) {
            handleMessage('Error deleting employee', 'error');
        }
    }

    const cancelDelete = () => {
        setShowDeleteBox(false);
    }



    return (
        <div id="deleteBox" >
            <div id="deleteAlert">
                <p>Are you sure you want to delete this Employee?</p>
                <div className="delete-button-container">
                    <button onClick={confirmDelete}>Yes</button>
                    <button onClick={cancelDelete}>No</button>
                </div>
            </div>
        </div>
    )
};

export default DeleteWarning;