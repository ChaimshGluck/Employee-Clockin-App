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
        password: null,
        hrPermission: false
    });
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
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
                    ...fetchedEmployee
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

        const updatedEmployee = {
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            isHr: employee.hrPermission,
            employeeId: employeeId
        }

        if (showPasswordFields) {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                handleMessage('Passwords do not match', 'error');
                return;
            } else {
                updatedEmployee.password = passwordData.newPassword;
            }
        }

        try {
            const result = await fetch(`${backendUrl}/hr/update`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(updatedEmployee)
            })
            if (result.ok) {
                handleMessage('Employee Info Updated!', 'success');
                setTimeout(() => {
                    changePage('Employees');
                }, 4000)
            }
        } catch {
            handleMessage('Error Updating Employee', 'error');
        }
    }

    if (isLoading || !employee) {
        return <p>Loading employee data...</p>;
    }

    return (
        <div>
            <h2>Update Employee</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="update-fname">First name:<span className="required">*</span></label>
                <input type="text" id='update-fname' name="firstName" value={employee.firstName}
                    onChange={handleChange}
                    required />

                <label htmlFor="update-lname">Last Name:</label>
                <input type="text" id='update-lname' name="lastName" value={employee.lastName}
                    onChange={handleChange}
                />

                <label htmlFor="update-email">Email Address:<span className="required">*</span></label>
                <input type="email" id='update-email' name="email" value={employee.email}
                    onChange={handleChange} required />

                <div className="checkbox-container">
                    <label htmlFor='update-hr-checkbox'>Grant HR Permissions</label>
                    <input type='checkbox' name='hrPermission' className='checkbox' id="update-hr-checkbox" checked={employee.hrPermission} onChange={handleChange} />
                </div>

                <div className='toggle-link'>
                    <button type="button" onClick={() => setShowPasswordFields(!showPasswordFields)}>
                        {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
                    </button>
                </div>

                {showPasswordFields && (
                    <>
                        <label htmlFor="update-pass">New Password:</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id='update-pass'
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                        />

                        <label htmlFor="update-confirm-pass">Confirm New Password:</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id='update-confirm-pass'
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                        />

                        <div className="checkbox-container">
                            <label htmlFor='password-update-checkbox'>Show Password</label>
                            <input
                                type='checkbox'
                                className='checkbox'
                                id='password-update-checkbox'
                                onChange={() => setShowPassword(!showPassword)}
                            />
                        </div>
                    </>
                )}

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