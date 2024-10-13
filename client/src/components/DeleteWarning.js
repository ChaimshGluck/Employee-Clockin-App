import { useContext, useState } from "react";
import { EmployeeContext } from "../App";
import LoadingSpinner from "./LoadingSpinner";
import { fetchFromBackend } from "../utils/api";

const DeleteWarning = ({ changePage, setShowDeleteBox, handleMessage }) => {
    const employeeId = useContext(EmployeeContext);
    const [isLoading, setIsLoading] = useState(false);

    const confirmDelete = async () => {
        setShowDeleteBox(false);
        setIsLoading(true);
        try {
            const response = await fetchFromBackend(`/hr/delete?employeeIdToDelete=${employeeId}`, 'include', 'DELETE');
            setShowDeleteBox(false);

            if (!response.ok) {
                throw new Error(response.message);
            }
            const message = 'Employee Deleted';
            handleMessage(message, 'success');
            const duration = Math.max(3000, message.length * 100);
            setTimeout(() => {
                changePage('Employees')
            }, duration);
        } catch (error) {
            console.error('Error deleting employee:', error);
            handleMessage('Error deleting employee', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    const cancelDelete = () => {
        setShowDeleteBox(false);
    }

    if (isLoading) {
        return <LoadingSpinner message={"Activating your account..."} />
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