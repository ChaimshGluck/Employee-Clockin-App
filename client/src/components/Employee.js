const Employee = ({ employee, onToggle }) => {

    return (
        <div>
            <p>First name: {employee.firstName}</p>
            {employee.lastName && <p>Last name: {employee.lastName}</p>}
            <p>Email: {employee.email}</p>
            <p>Role: {employee.role}</p>
            <p>Date hired: {employee.dateHired}</p>
            <p><button onClick={() => onToggle('UpdateEmployee')}>Update employee info</button></p>
        </div>
    )
}

export default Employee;