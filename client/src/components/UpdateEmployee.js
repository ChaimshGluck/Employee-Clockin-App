import { useContext, useEffect, useState } from "react";
import { Field, Form, Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { EmployeeContext } from "../App";
import DeleteWarning from "./DeleteWarning";
import ValidationMessage from "./ValidationMessage";
import { FaArrowLeft } from "react-icons/fa";
import { fetchFromBackend } from "../utils/api";
import AppTitle from "./AppTitle";

const UpdateEmployee = ({ changePage, handleMessage, updateType, setCurrentUser }) => {
    const employeeToUpdate = useContext(EmployeeContext);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showDeleteBox, setShowDeleteBox] = useState(false);

    const RevalidateOnSchemaChange = ({ validationSchema }) => {
        const { validateForm } = useFormikContext();
        useEffect(() => {
            validateForm();
        }, [validationSchema, validateForm]);
        return null;
    };

    const EmployeeSchema = Yup.object({
        firstName: Yup.string()
            .required('Please enter employee\'s first name.')
            .max(15, 'First name must be 15 characters or fewer.'),
        lastName: Yup.string()
            .max(15, 'Last name must be 15 characters or fewer.'),
        email: Yup.string()
            .required('Please enter employee\'s email address.')
            .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                'Please enter a valid email address (e.g., name@example.com).')
    });

    const EmployeeSchemaWithPass = EmployeeSchema.shape({
        newPassword: Yup.string()
            .required('Please enter your password.')
            .min(8, 'Password must be at least 8 characters long.')
            .max(20, 'Password must be 20 characters or fewer.'),
        confirmPassword: Yup.string()
            .required('Please confirm your password.')
            .oneOf([Yup.ref('newPassword'), null], 'Passwords do not match. Please confirm your password.')
    })

    const handleBack = () => {
        changePage(updateType === 'employee' ? 'Employees' : 'Profile');
        localStorage.removeItem('employeeToUpdate');
    }

    return (
        <Formik
            initialValues={{
                firstName: employeeToUpdate.firstName || '',
                lastName: employeeToUpdate.lastName || '',
                email: employeeToUpdate.email || '',
                newPassword: '',
                confirmPassword: '',
                hrPermission: employeeToUpdate.role === 'HR' || false,
            }}
            validationSchema={showPasswordFields ? EmployeeSchemaWithPass : EmployeeSchema}
            validateOnMount={true}
            validateOnChange={true}
            onSubmit={async (values) => {
                const updatedEmployee = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    isHr: values.hrPermission,
                    employeeId: employeeToUpdate.employeeId
                };

                if (showPasswordFields && values.newPassword) {
                    updatedEmployee.password = values.newPassword;
                }

                try {
                    const response = await fetchFromBackend('/hr/update', 'include', 'PATCH', updatedEmployee);
                    if (!response.ok) {
                        if (response.message === 'Email already in use') {
                            handleMessage('Email already in use. Please enter a different email address.', 'error');
                            return;
                        } else {
                            throw new Error(response.message);
                        }
                    }
                    setCurrentUser({ ...employeeToUpdate, ...updatedEmployee, fullName: `${updatedEmployee.firstName} ${updatedEmployee.lastName}` });
                    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                    const updatedUser = { ...currentUser, ...updatedEmployee, fullName: `${updatedEmployee.firstName} ${updatedEmployee.lastName}` };
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

                    const message = `${updateType === 'employee' ? 'Employee Info' : 'Profile'} Updated!`;

                    // Check if email was changed
                    if (employeeToUpdate.email !== updatedEmployee.email) {
                        const jsxMessage = (
                            <div>
                                <h3>{message}</h3>
                                {updateType === 'employee' ?
                                    <p>An activation link has been sent to the employee's new email. They must activate their account before logging in.</p> :
                                    <p>An activation link has been sent to your new email. You must activate your account before logging in.</p>}
                            </div>
                        )
                        handleMessage(jsxMessage, 'info', true);
                        if (updateType === 'profile') {
                            localStorage.clear();
                        }
                        changePage(updateType === 'employee' ? 'Employees' : 'LogIn');
                        return;
                    }

                    handleMessage(message, 'success');
                    const duration = Math.max(3000, message.length * 100);
                    setTimeout(() => {
                        changePage(updateType === 'employee' ? 'Employees' : 'Profile');
                    }, duration);
                } catch (error) {
                    console.error('Error updating employee:', error);
                    handleMessage('Error Updating Employee', 'error');
                }
            }}
        >
            {({ errors, isValid, touched, values, handleChange, handleBlur, setFieldValue, setTouched }) => (
                <div>
                    <AppTitle />
                    <div className="toggle-link">
                        <button className="back-button" onClick={handleBack}>
                            <FaArrowLeft className="back-icon" /> Back to {updateType === 'employee' ? 'Employees' : 'Profile'} Page
                        </button>
                    </div>

                    <h2>Update {updateType === 'employee' ? 'Employee Info' : 'Profile'}</h2>
                    <Form >
                        <RevalidateOnSchemaChange validationSchema={showPasswordFields ? EmployeeSchemaWithPass : EmployeeSchema} />
                        <label htmlFor="update-firstName">First Name:<span className="required">*</span></label>
                        <Field
                            type="text"
                            id='update-firstName'
                            name="firstName"
                            className={errors.firstName && touched.firstName ? 'invalid' : ''}
                        />
                        {errors.firstName && touched.firstName && (
                            <ValidationMessage message={errors.firstName} />
                        )}

                        <label htmlFor="update-lastName">Last Name:</label>
                        <Field
                            type="text"
                            id='update-lastName'
                            name="lastName"
                            className={errors.lastName && touched.lastName ? 'invalid' : ''}
                        />
                        {errors.lastName && touched.lastName && (
                            <ValidationMessage message={errors.lastName} />
                        )}

                        <label htmlFor="update-email">Email Address:<span className="required">*</span></label>
                        <Field
                            type="email"
                            id='update-email'
                            name="email"
                            className={errors.email && touched.email ? 'invalid' : ''}
                        />
                        {errors.email && touched.email && (
                            <ValidationMessage message={errors.email} />
                        )}

                        {updateType === 'employee' && (
                            <div className="checkbox-container">
                                <label htmlFor='update-hrPermission'>Grant HR Permissions</label>
                                <Field
                                    type='checkbox'
                                    id="update-hrPermission"
                                    name='hrPermission'
                                    className='checkbox'
                                    checked={values.hrPermission}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </div>
                        )}

                        <div className='toggle-link'>
                            <button type="button" onClick={() => {
                                if (showPasswordFields) {
                                    setFieldValue('newPassword', '');
                                    setFieldValue('confirmPassword', '');
                                }
                                setShowPasswordFields(!showPasswordFields);
                                setTouched({
                                    newPassword: showPasswordFields,
                                    confirmPassword: showPasswordFields,
                                });
                            }}>
                                {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
                            </button>
                        </div>

                        {showPasswordFields && (
                            <>
                                <label htmlFor="update-newPassword">New Password:<span className="required">*</span></label>
                                <Field
                                    type={showPassword ? "text" : "password"}
                                    id='update-newPassword'
                                    name="newPassword"
                                    className={(errors.newPassword || errors.confirmPassword) && touched.newPassword ? 'invalid' : ''}
                                />
                                {errors.newPassword && touched.newPassword && (
                                    <ValidationMessage message={errors.newPassword} />
                                )}

                                <label htmlFor="update-confirmPassword">Confirm New Password:<span className="required">*</span></label>
                                <Field
                                    type={showPassword ? "text" : "password"}
                                    id='update-confirmPassword'
                                    name="confirmPassword"
                                    className={errors.confirmPassword && touched.confirmPassword ? 'invalid' : ''}
                                />
                                {errors.confirmPassword && touched.confirmPassword && (
                                    <ValidationMessage message={errors.confirmPassword} />
                                )}

                                <div className="checkbox-container">
                                    <label htmlFor='password-update-checkbox'>Show Password</label>
                                    <input
                                        type='checkbox'
                                        id='password-update-checkbox'
                                        className='checkbox'
                                        checked={showPassword}
                                        onChange={() => setShowPassword(!showPassword)}
                                    />
                                </div>
                            </>
                        )}

                        <button type="submit" disabled={!isValid}>Update</button>
                    </Form>
                    <hr className="divider" />
                    <div className="toggle-link">
                        <p><button onClick={() => setShowDeleteBox(true)}>Delete {updateType === 'employee' ? 'Employee' : 'Account'}</button></p>
                    </div>
                    {showDeleteBox &&
                        <DeleteWarning
                            setShowDeleteBox={setShowDeleteBox}
                            changePage={changePage}
                            handleMessage={handleMessage}
                            updateType={updateType}
                        />
                    }
                </div>
            )}
        </Formik >
    );
};

export default UpdateEmployee;
