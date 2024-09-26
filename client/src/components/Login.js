import { useState } from 'react';

function LogIn({ changePage, setEmployeeId, setFullName, fetchUserRole, handleMessage, backendUrl }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/employee/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          username: email,
          password: password
        })
      })

      if (response.status === 401) {
        setIsLoading(false);
        const { message } = await response.json();
        handleMessage(message, 'error');
        return
      }
      const data = await response.json();
      setIsLoading(false);
      localStorage.setItem('token', data.token);
      localStorage.setItem('employee', JSON.stringify(data.employee));
      setEmployeeId(data.employee.employeeId);
      setFullName(data.employee.fullName);
      fetchUserRole();
      changePage('ClockInOut');
    } catch (e) {
      setIsLoading(false);
      console.error('Login error:', e);
      handleMessage('An error occurred while logging in. Please try again later.', 'error');
    }
  };

  if (isLoading) {
    return <p>Logging in...</p>;
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