import { useState } from 'react';
import { Formik } from 'formik';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import * as Yup from 'yup';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

function Register({ changePage, handleMessage }) {

  const [showPassword, setShowPassword] = useState(false);

  const UserSchema = Yup.object({
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
      validationSchema={UserSchema}
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
      {(formik) => (
        <div>
          <h2>Register Employee</h2>
          <form onSubmit={formik.handleSubmit}>

            <label htmlFor='register-firstName'>First Name:<span className="required">*</span></label>
            <input
              type="text"
              id='register-firstName'
              name='firstName'
              className={formik.errors.firstName && formik.touched.firstName ? 'invalid' : ''}
              {...formik.getFieldProps('firstName')}
            />
            {formik.errors.firstName && formik.touched.firstName && (
              <div className="error-message">
                <AiOutlineExclamationCircle className="error-message-icon" />
                {formik.errors.firstName}
              </div>
            )}

            <label htmlFor='register-lastName'>Last Name:</label>
            <input
              type="text"
              id='register-lastName'
              name='lastName'
              className={formik.errors.lastName && formik.touched.lastName ? 'invalid' : ''}
              {...formik.getFieldProps('lastName')}
            />
            {formik.errors.lastName && formik.touched.lastName && (
              <div className="error-message">
                <AiOutlineExclamationCircle className="error-message-icon" />
                {formik.errors.lastName}
              </div>
            )}

            <label htmlFor='register-email'>Email Address:<span className="required">*</span></label>
            <input
              type="email"
              id='register-email'
              name='email'
              className={formik.errors.email && formik.touched.email ? 'invalid' : ''}
              {...formik.getFieldProps('email')}
            />
            {formik.errors.email && formik.touched.email && (
              <div className="error-message">
                <AiOutlineExclamationCircle className="error-message-icon" />
                {formik.errors.email}
              </div>
            )}

            <label htmlFor='register-password'>Password:<span className="required">*</span></label>
            <input
              type={showPassword ? "text" : "password"}
              id='register-password'
              name="password"
              className={(formik.errors.password || formik.errors.confirmPassword) && formik.touched.password ? 'invalid' : ''}
              {...formik.getFieldProps('password')}
            />
            {formik.errors.password && formik.touched.password && (
              <div className="error-message">
                <AiOutlineExclamationCircle className="error-message-icon" />
                {formik.errors.password}
              </div>
            )}

            <label htmlFor='register-confirmPassword'>Confirm Password:<span className="required">*</span></label>
            <input
              type={showPassword ? "text" : "password"}
              id='register-confirmPassword'
              name="confirmPassword"
              className={formik.errors.confirmPassword && formik.touched.confirmPassword ? 'invalid' : ''}
              {...formik.getFieldProps('confirmPassword')}
            />
            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
              <div className="error-message">
                <AiOutlineExclamationCircle className="error-message-icon" />
                {formik.errors.confirmPassword}
              </div>
            )}

            <div className="checkbox-container">
              <label htmlFor='register-passCheckbox'>Show Password</label>
              <input
                type='checkbox'
                className='checkbox'
                id='register-passCheckbox'
                onChange={() => setShowPassword(!showPassword)}
              />
            </div>

            <div className="checkbox-container">
              <label htmlFor='register-hrPermission'>Grant HR Permissions</label>
              <input
                type='checkbox'
                className='checkbox'
                id='register-hrPermission'
                {...formik.getFieldProps('hrPermission')}
              />
            </div>

            <button type="submit" disabled={!(formik.isValid && formik.dirty)}>Register</button>
          </form>
          <div className="toggle-link">
            <p><button onClick={() => changePage('ClockInOut')}>Back to Clock In/Out Page</button></p>
          </div>
        </div>
      )}
    </ Formik>
  )
}

export default Register;
