import { useEffect, useState } from "react";
import Employee from "./Employee";
import LoadingSpinner from "./LoadingSpinner";
import { FaArrowLeft } from 'react-icons/fa';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Employees = ({ changePage, handleMessage }) => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        const getAllEmployees = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${backendUrl}/hr/employees`, {
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include'
                })
                const responseEmployees = await response.json();
                setEmployees(responseEmployees.employees);
                setIsLoading(false);
            } catch (e) {
                setIsLoading(false);
                handleMessage(e, 'error');
            }
        }
        getAllEmployees()
    }, [handleMessage])

    if (isLoading) {
        return <LoadingSpinner isLoading={isLoading} message={"Getting Employees..."} />
    }

    return (
        <>
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