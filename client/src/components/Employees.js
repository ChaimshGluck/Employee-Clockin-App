import { useEffect, useState } from "react";
import Employee from "./Employee";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Employees = ({ changePage }) => {
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
                alert(e)
            }
        }
        getAllEmployees()
    }, [])

    if (isLoading) {
        return <p>Getting Employees...</p>;
    }

    return (
        <>
            <div className="toggle-link">
                <p><button onClick={() => changePage('ClockInOut')}>Back to clockin page</button></p>
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