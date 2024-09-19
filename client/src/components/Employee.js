import { useContext } from "react";
import { EmployeeContext } from "../App";

const Employee = ({ employee, setCurrentPage }) => {
    const setEmployeeIdToUpdate = useContext(EmployeeContext);

    const handleToggle = (page) => {
        localStorage.setItem('currentPage', page);
        setCurrentPage(page);
        setEmployeeIdToUpdate(employee.employeeId)
    }

    return (
        <div>
            <p>First name: {employee.firstName}</p>
            {employee.lastName && <p>Last name: {employee.lastName}</p>}
            <p>Email: {employee.email}</p>
            <p>Role: {employee.role}</p>
            <p>Date hired: {employee.dateHired}</p>
            <p><button onClick={() => handleToggle('UpdateEmployee')}
            >Update employee info</button></p>
        </div>
    )
}

export default Employee;