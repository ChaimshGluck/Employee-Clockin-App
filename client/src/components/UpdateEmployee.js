import { useContext, useEffect, useState } from "react";
import { EmployeeContext } from "../App";
import DeleteWarning from "./DeleteWarning";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const UpdateEmployee = ({ changePage, handleMessage }) => {
    const employeeId = useContext(EmployeeContext);
    const [isLoading, setIsLoading] = useState(true);
    const [employee, setEmployee] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        hrPermission: false
    });
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showDeleteBox, setShowDeleteBox] = useState(false);

    useEffect(() => {
        const getEmployee = async () => {
            try {
                const response = await fetch(`${backendUrl}/hr/employee?employeeIdToUpdate=${employeeId}`, {
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include'
                })
                const { fetchedEmployee } = await response.json();
                setEmployee(prevData => ({
                    ...prevData,
                    ...fetchedEmployee,
                    hrPermission: fetchedEmployee.role === 'HR'
                }));
                setIsLoading(false);
            } catch (error) {
                console.error('Fetching employee data failed:', error);
                handleMessage('Failed to load employee data', 'error');
                setIsLoading(false);
            }
        }
        getEmployee();
    }, [employeeId, handleMessage])

    const handleChange = (e) => {
        const { type, name, value, checked } = e.target;
        setEmployee(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (showPasswordFields && passwordData.newPassword !== passwordData.confirmPassword) {
            handleMessage('Passwords do not match', 'error');
            return;
        }

        try {
            const updatedEmployee = {
                ...employee,
                password: showPasswordFields ? passwordData.newPassword : employee.password
            };
            const result = await fetch(`${backendUrl}/hr/update`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({
                    firstName: updatedEmployee.firstName,
                    lastName: updatedEmployee.lastName,
                    email: updatedEmployee.email,
                    password: updatedEmployee.password,
                    isHr: updatedEmployee.hrPermission,
                    employeeId: employeeId
                })
            })
            if (result.ok) {
                handleMessage('Employee Info Updated!', 'success');
                localStorage.setItem('currentPage', 'Employees');
                changePage('Employees');
            }
        } catch {
            handleMessage('Error registering employee', 'error');
        }
    }

    if (isLoading || !employee) {
        return <p>Loading employee data...</p>;
    }

    return (
        <div>
            <h2>Update Employee</h2>
            <form onSubmit={handleSubmit}>
                <label>First name:</label>
                <input type="text" name="firstName" value={employee.firstName}
                    onChange={handleChange}
                    required />

                <label>Last Name:</label>
                <input type="text" name="lastName" value={employee.lastName}
                    onChange={handleChange}
                />

                <label>Email Address:</label>
                <input type="email" name="email" value={employee.email}
                    onChange={handleChange} required />

                <div className='toggle-link'>
                    <button type="button" onClick={() => setShowPasswordFields(!showPasswordFields)}>
                        {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
                    </button>
                </div>

                {showPasswordFields && (
                    <>
                        <label>New Password:</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                        />

                        <label>Confirm New Password:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                        />
                    </>
                )}

                <label htmlFor='hr-checkbox'>Grant HR Permissions</label>
                <input type='checkbox' name='hrPermission' id='hr-checkbox' checked={employee.hrPermission} onChange={handleChange} />

                <button type="submit">Update</button>
            </form>
            <div className="toggle-link">
                <p><button onClick={() => setShowDeleteBox(true)}>Delete Employee</button></p>
            </div>
            {showDeleteBox &&
                <DeleteWarning
                    setShowDeleteBox={setShowDeleteBox}
                    changePage={changePage}
                    handleMessage={handleMessage}
                />
            }
            <div className="toggle-link">
                <p><button onClick={() => changePage('Employees')}>Back to Clock In/Out Page</button></p>
            </div>
        </div>
    )
}

export default UpdateEmployee;