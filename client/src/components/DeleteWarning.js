import { useContext, useState } from "react";
import { EmployeeContext } from "../App";
import LoadingSpinner from "./LoadingSpinner";
import { fetchFromBackend } from "../utils/api";

const DeleteWarning = ({ changePage, setShowDeleteBox, handleMessage, updateType }) => {
    const employeeId = useContext(EmployeeContext).employeeId;
    const [isLoading, setIsLoading] = useState(false);

    const confirmDelete = async () => {
        const deleteType = updateType === 'employee' ? 'Employee' : 'Account';
        setShowDeleteBox(false);
        setIsLoading(true);
        try {
            const response = await fetchFromBackend(`/hr/delete?employeeIdToDelete=${employeeId}`, 'include', 'DELETE');
            setShowDeleteBox(false);

            if (!response.ok) {
                throw new Error(response.message);
            }
            const message = `${deleteType} Deleted`;
            handleMessage(message, 'success');
            const duration = Math.max(3000, message.length * 100);
            setTimeout(() => {
                if (updateType === 'profile') {
                    localStorage.clear();
                    changePage('Login');
                    return;
                }
                changePage('Employees');
            }, duration);
        } catch (error) {
            console.error(`Error deleting ${deleteType}:`, error);
            handleMessage(`Error deleting ${deleteType}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }

    const cancelDelete = () => {
        setShowDeleteBox(false);
    }

    if (isLoading) {
        return <LoadingSpinner message={`Deleting ${updateType === 'employee' ? 'employee' : 'your account'}...`} />
    }

    return (
        <div id="deleteBox" >
            <div id="deleteAlert">
                <p>Are you sure you want to delete {updateType === 'employee' ? 'this employee' : 'your account'}?</p>
                <div className="delete-button-container">
                    <button onClick={confirmDelete}>Yes</button>
                    <button onClick={cancelDelete}>No</button>
                </div>
            </div>
        </div>
    )
};

export default DeleteWarning;