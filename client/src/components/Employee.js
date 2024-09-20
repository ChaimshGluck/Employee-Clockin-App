import { useContext } from "react";
import { EmployeeContext } from "../App";

const Employee = ({ employee, changePage }) => {
    const setEmployeeIdToUpdate = useContext(EmployeeContext);

    return (
        <div>
            <p>First name: {employee.firstName}</p>
            {employee.lastName && <p>Last Name: {employee.lastName}</p>}
            <p>Email: {employee.email}</p>
            <p>Role: {employee.role}</p>
            <p>Date Hired: {employee.dateHired}</p>
            <p><button onClick={() => { changePage('UpdateEmployee'); setEmployeeIdToUpdate(employee.employeeId) }}
            >Update Employee Info</button></p>
        </div>
    )
}

export default Employee;