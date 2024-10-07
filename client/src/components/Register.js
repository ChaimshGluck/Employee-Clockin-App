import { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ValidationMessage from './ValidationMessage.js';
import { FaArrowLeft } from 'react-icons/fa';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

function Register({ changePage, handleMessage }) {

  const [showPassword, setShowPassword] = useState(false);

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
        try {
          const response = await fetch(`${backendUrl}/hr/register`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              password: values.password,
              isHr: values.hrPermission
            })
          })
          const result = await response.json();
          if (result.ok) {
            handleMessage('New Employee Registered!', 'success');
            setTimeout(() => {
              changePage('ClockInOut');
            }, 4000)
          } else {
            handleMessage(result.error, 'error')
          }
        } catch (error) {
          handleMessage('Error Registering Employee', 'error');
        }
      }}
    >
      {({ errors, touched, isValid, dirty }) => (
        <div>
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
