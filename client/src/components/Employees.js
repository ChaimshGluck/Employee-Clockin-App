import { useEffect, useState } from "react";
import Employee from "./Employee";
import LoadingSpinner from "./LoadingSpinner";
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
        return <LoadingSpinner isLoading={isLoading} message={"Getting Employees..."}/>
    }

    return (
        <>
            <div className="toggle-link">
                <p><button onClick={() => changePage('ClockInOut')}>Back to Clock In/Out Page</button></p>
            </div>
            <ul>
                {
                    employees.map((employee, index) => (
                        (
                            <li key={index}>< Employee employee={employee} changePage={changePage} /></li>
                        )
                    ))
                }
            </ul>
        </>
    )
}

export default Employees;