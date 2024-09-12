import { useContext } from "react";
import { UserContext } from "../App";

const Employee = ({ employee, onToggle }) => {
    const setEmployeeIdToUpdate = useContext(UserContext);

    return (
        <div>
            <p>First name: {employee.firstName}</p>
            {employee.lastName && <p>Last name: {employee.lastName}</p>}
            <p>Email: {employee.email}</p>
            <p>Role: {employee.role}</p>
            <p>Date hired: {employee.dateHired}</p>
            <p><button onClick={() => { onToggle('UpdateEmployee'); setEmployeeIdToUpdate(employee.employeeId) }}
            >Update employee info</button></p>
        </div>
    )
}

export default Employee;