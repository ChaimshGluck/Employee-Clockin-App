import { useState } from 'react';
import { useFormik } from 'formik';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

function Register({ changePage, handleMessage }) {

  const [showPassword, setShowPassword] = useState(false);

  const validate = (values) => {
    const errors = {};

    if (!values.firstName) {
      errors.firstName = 'Please enter your first name.'
    } else if (values.firstName.length > 15) {
      errors.firstName = 'First name must be 15 characters or fewer.'
    }

    if (values.lastName.length > 15) {
      errors.lastName = 'Last name must be 15 characters or fewer.'
    }

    if (!values.email) {
      errors.email = 'Please enter your email address.'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Please enter a valid email address (e.g., name@example.com).'
    }

    if (!values.password) {
      errors.password = 'Please enter your password.'
    } else if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.'
    } else if (values.password.length > 20) {
      errors.password = 'Password must be 20 characters or fewer.'
    }

    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match. Please confirm your password.'
    }

    return errors
  }

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      hrPermission: false
    },
    validate,
    validateOnMount: true,
    onSubmit: async (values) => {
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
    }
  })

  return (
    <div>
      <h2>Register Employee</h2>
      <form onSubmit={formik.handleSubmit}>

        <label htmlFor='register-firstName'>First Name:<span className="required">*</span></label>
        <input
          type="text"
          id='register-firstName'
          name='firstName'
          className={formik.errors.firstName && formik.touched.firstName ? 'invalid' : ''}
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
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
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
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
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
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
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
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
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
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
            name='hrPermission'
            checked={formik.values.hrPermission}
            onChange={formik.handleChange}
          />
        </div>

        <button type="submit" disabled={!(formik.isValid && formik.dirty)}>Register</button>
      </form>
      <div className="toggle-link">
        <p><button onClick={() => changePage('ClockInOut')}>Back to Clock In/Out Page</button></p>
      </div>
    </div>
  );
}

export default Register;
