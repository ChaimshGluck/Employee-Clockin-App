import { useState } from 'react';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

function Login({ onToggle, setIsHr, setEmployeeId, setFullName }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
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
      if (!response.ok) {
        throw new Error('Invalid email or password');
      }
      const { employee } = await response.json();
      setEmployeeId(employee.employeeId);
      setFullName(employee.fullName);
      if (employee.role === 'hr') {
        setIsHr(true)
      };
      onToggle();
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <label>Email address:</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default Login;
