import { useEffect, useState } from "react";
import Employee from "./Employee";
import LoadingSpinner from "./LoadingSpinner";
import { FaArrowLeft } from 'react-icons/fa';
import { fetchFromBackend } from "../utils/api";
import AppTitle from "./AppTitle";
const Employees = ({ changePage, handleMessage }) => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        const getAllEmployees = async () => {
            setIsLoading(true);
            try {
                const response = await fetchFromBackend(`/hr/employees`, 'include')
                if (!response.ok) {
                    throw new Error(response.message);
                }
                setEmployees(response.employees);
            } catch (error) {
                console.error('Error getting employees:', error);
                handleMessage('Error getting employees', 'error');
                changePage('ClockInOut');
            } finally {
                setIsLoading(false);
            }
        }
        getAllEmployees()
    }, [handleMessage, changePage])

    if (isLoading) {
        return <LoadingSpinner message={"Getting Employees..."} />
    }

    return (
        <>
            <AppTitle />
            <div className="toggle-link">
                <button className="back-button" onClick={() => changePage('ClockInOut')}>
                    <FaArrowLeft className="back-icon" /> Back to Clock In/Out Page
                </button>
            </div>
            <h2>Employee Directory</h2>
            <ul className="list-container">
                {employees.length === 0 ? (
                    <p className="no-records">No employees found.</p>
                ) : (
                    employees.map((employee) => (
                        <li key={employee.employeeId} className="list-item">
                            <Employee employee={employee} changePage={changePage} />
                        </li>
                    ))
                )}
            </ul>
        </>
    );
}

export default Employees;