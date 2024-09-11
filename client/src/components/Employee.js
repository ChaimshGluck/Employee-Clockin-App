const Employee = ({ employeeDetails }) => {

    return (
        <div>
            <p>First name: {employeeDetails.firstName}</p>
            {employeeDetails.lastName && <p>Last name: {employeeDetails.lastName}</p>}
            <p>Email: {employeeDetails.email}</p>
            <p>Role: {employeeDetails.role}</p>
            <p>Date hired: {employeeDetails.dateHired}</p>
        </div>
    )
}

export default Employee;