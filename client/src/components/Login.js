import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { fetchFromBackend } from '../utils/api';

function LogIn({ changePage, setEmployeeId, setFullName, fetchUserRole, handleMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetchFromBackend('/employee/login', 'include', 'POST', {
        username: email,
        password: password
      });

      if (!response.ok) {
        if (response.message === 'Invalid email or password' || response.message === 'Account is not active. Please check your email for activation instructions.') {
          handleMessage(response.message, 'error');
          setIsLoading(false);
          return;
        } else {
          console.error('Error logging in:')
          throw new Error(response.message);
        }
      }

      // Save token and employee data to local storage
      localStorage.setItem('token', response.token);
      localStorage.setItem('employee', JSON.stringify(response.employee));
      setEmployeeId(response.employee.employeeId);
      setFullName(response.employee.fullName);
      fetchUserRole();
      changePage('ClockInOut');
    } catch (error) {
      console.error('Error logging in:', error);
      handleMessage('An error occurred while logging in. Please try again later.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message={"Logging in..."} />
  }

  return (
    <div>
      <h1>Employee Management System</h1>
      <h3>Log in to access your company's employee portal. This platform is designed for registered employees and HR personnel to manage clock-in/out records, employee information, and more.</h3>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <label htmlFor='email-login'>Email Address:</label>
        <input type="email" id='email-login' value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor='password-login'>Password:</label>
        <input type={showPassword ? "text" : "password"} id='password-login' value={password} onChange={(e) => setPassword(e.target.value)} required />

        <div className="checkbox-container">
          <label htmlFor='password-login-checkbox'>Show Password</label>
          <input type='checkbox' className='checkbox' id='password-login-checkbox' onChange={() => setShowPassword(!showPassword)} />
        </div>

        <button type="submit">Sign In</button>
      </form>
      <h4>Please contact your HR department if you need assistance logging in.</h4>
    </div>
  );
}

export default LogIn;