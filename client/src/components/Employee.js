import { useContext } from "react";
import { EmployeeContext } from "../App";

const Employee = ({ employee, changePage }) => {
    const setEmployeeIdToUpdate = useContext(EmployeeContext);

    return (
        <div>
            <p>First name: {employee.firstName}</p>
            {employee.lastName && <p>Last name: {employee.lastName}</p>}
            <p>Email: {employee.email}</p>
            <p>Role: {employee.role}</p>
            <p>Date hired: {employee.dateHired}</p>
            <p><button onClick={() => { changePage('UpdateEmployee'); setEmployeeIdToUpdate(employee.employeeId) }}
            >Update employee info</button></p>
        </div>
    )
}

export default Employee;