import { useEffect, useState } from "react";
import Employee from "./Employee";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Employees = ({ onToggle }) => {
    const [employees, setEmployees] = useState([]);


    useEffect(() => {

        const getAllEmployees = async () => {
            try {
                const response = await fetch(`${backendUrl}/hr/employees`, {
                    headers: { "Content-Type": "application/json" }
                })
                const responseEmployees = await response.json();
                setEmployees(responseEmployees.employees);
            } catch (e) {
                alert(e)
            }
        }
        getAllEmployees()
    }, [])


    return (
        <>
            <div className="toggle-link">
                <p><button onClick={onToggle}>Back to clockin page</button></p>
            </div>
            <ul>
                {
                    employees.map((employee, index) => (
                        (
                            <li key={index}>< Employee employee={employee} onToggle={() => onToggle('Update-Employee')}/></li>
                        )
                    ))
                }
            </ul>
        </>
    )
}

export default Employees;