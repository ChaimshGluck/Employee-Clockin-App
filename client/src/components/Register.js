import { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ValidationMessage from './ValidationMessage.js';
import { FaArrowLeft } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner.js';
import { fetchFromBackend } from '../utils/api.js';
import AppTitle from './AppTitle.js';

function Register({ changePage, handleMessage }) {

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const EmployeeSchema = Yup.object({
    firstName: Yup.string()
      .required('Please enter your first name.')
      .max(15, 'First name must be 15 characters or fewer.'),
    lastName: Yup.string()
      .max(15, 'Last name must be 15 characters or fewer.'),
    email: Yup.string()
      .required('Please enter your email address.')
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please enter a valid email address (e.g., name@example.com).'),
    password: Yup.string()
      .required('Please enter your password.')
      .min(8, 'Password must be at least 8 characters long.')
      .max(20, 'Password must be 20 characters or fewer.'),
    confirmPassword: Yup.string()
      .required('Please confirm your password.')
      .oneOf([Yup.ref('password'), null], 'Passwords do not match. Please confirm your password.')
  })

  if (isLoading) {
    return <LoadingSpinner message={"Registering New Employee..."} />
  }

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        hrPermission: false
      }}
      validationSchema={EmployeeSchema}
      onSubmit={async (values) => {
        setIsLoading(true);
        try {
          const response = await fetchFromBackend(`/hr/register`, 'same-origin', 'POST', {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            isHr: values.hrPermission
          })
          if (!response.ok) {
            if (response.message === 'Email already in use') {
              handleMessage('Email already in use. Please enter a different email address.', 'error');
              return;
            } else {
              throw new Error(response.message);
            }
          }
          const jsxMessage = (
            <div>
              <h3>Employee Registered!</h3>
              <p>An activation link has been sent to the employee's email. They must activate their account before logging in.</p>
            </div>
          )
          handleMessage(jsxMessage, 'info', true);
          changePage('ClockInOut');
        } catch (error) {
          console.error('Error Registering Employee:', error);
          handleMessage('Error Registering Employee', 'error');
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {({ errors, touched, isValid, dirty }) => (
        <div>
          <AppTitle />
          <div className="toggle-link">
            <button className="back-button" onClick={() => changePage('ClockInOut')}>
              <FaArrowLeft className="back-icon" /> Back to Clock In/Out Page
            </button>
          </div>

          <h2>Register Employee</h2>
          <Form >

            <label htmlFor='register-firstName'>First Name:<span className="required">*</span></label>
            <Field
              type="text"
              id='register-firstName'
              name='firstName'
              className={errors.firstName && touched.firstName ? 'invalid' : ''}
            />
            {errors.firstName && touched.firstName && (
              <ValidationMessage message={errors.firstName} />
            )}

            <label htmlFor='register-lastName'>Last Name:</label>
            <Field
              type="text"
              id='register-lastName'
              name='lastName'
              className={errors.lastName && touched.lastName ? 'invalid' : ''}
            />
            {errors.lastName && touched.lastName && (
              <ValidationMessage message={errors.lastName} />
            )}

            <label htmlFor='register-email'>Email Address:<span className="required">*</span></label>
            <Field
              type="email"
              id='register-email'
              name='email'
              placeholder='e.g., name@example.com'
              className={errors.email && touched.email ? 'invalid' : ''}
            />
            {errors.email && touched.email && (
              <ValidationMessage message={errors.email} />
            )}

            <label htmlFor='register-password'>Password:<span className="required">*</span></label>
            <Field
              type={showPassword ? "text" : "password"}
              id='register-password'
              name="password"
              className={(errors.password || errors.confirmPassword) && touched.password ? 'invalid' : ''}
            />
            {errors.password && touched.password && (
              <ValidationMessage message={errors.password} />
            )}

            <label htmlFor='register-confirmPassword'>Confirm Password:<span className="required">*</span></label>
            <Field
              type={showPassword ? "text" : "password"}
              id='register-confirmPassword'
              name="confirmPassword"
              className={errors.confirmPassword && touched.confirmPassword ? 'invalid' : ''}
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <ValidationMessage message={errors.confirmPassword} />
            )}

            <div className="checkbox-container">
              <label htmlFor='register-passCheckbox'>Show Password</label>
              <input
                type='checkbox'
                className='checkbox'
                id='register-passCheckbox'
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
            </div>

            <div className="checkbox-container">
              <label htmlFor='register-hrPermission'>Grant HR Permissions</label>
              <Field
                type='checkbox'
                className='checkbox'
                id='register-hrPermission'
                name='hrPermission'
              />
            </div>

            <button type="submit" disabled={!(isValid && dirty)}>Register</button>
          </Form>
        </div>
      )}
    </ Formik>
  )
}

export default Register;
