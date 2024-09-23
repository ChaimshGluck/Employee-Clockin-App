import { useState } from 'react';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

function LogIn({ changePage, setEmployeeId, setFullName, fetchUserRole, handleMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

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
      await fetchUserRole();
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
        <label>Email Address:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:</label>
        <div className='password-container'>
          <input type={passwordVisible ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type='button' className="toggle-password-btn" onClick={() => setPasswordVisible(!passwordVisible)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
              <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
              <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
              <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
            </svg>
          </button>
        </div>

        <button type="submit">Sign In</button>
      </form>
      <h4>Please contact your HR department if you need assistance logging in.</h4>
    </div>
  );
}

export default LogIn;
