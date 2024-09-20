import { useContext } from "react";
import { EmployeeContext } from "../App";
const backendUrl = process.env.REACT_APP_BACKEND_URL;


const DeleteWarning = ({ changePage, setShowDeleteBox }) => {
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
                alert('Employee deleted');
                localStorage.setItem('currentPage', 'Employees');
                changePage('Employees');
            } else {
                alert(result.error)
            }
        } catch (error) {
            alert('Error deleting employee');
        }
    }

    const cancelDelete = () => {
        setShowDeleteBox(false);
    }



    return (
        <div id="deleteBox" >
            <div id="deleteAlert">
                <p>Are you sure you want to delete?</p>
                <div className="delete-button-container">
                    <button onClick={confirmDelete}>Yes</button>
                    <button onClick={cancelDelete}>No</button>
                </div>
            </div>
        </div>
    )
};

export default DeleteWarning;