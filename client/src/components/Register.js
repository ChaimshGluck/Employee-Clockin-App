import { useState } from 'react';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

function Register({ setCurrentPage }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState({
    password: '',
    confirmPassword: ''
  });
  const [hrPermission, setHrPermission] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password.password !== password.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/hr/register`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password.password,
          isHr: hrPermission
        })
      })
      const result = await response.json();
      if (result.ok) {
        alert('New employee registered!');
        localStorage.setItem('currentPage', 'ClockInOut')
        setCurrentPage();
      } else {
        alert(result.error)
      }
    } catch (error) {
      alert('Error registering employee');
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleToggle = () => {
    localStorage.setItem('currentPage', 'ClockInOut');
    setCurrentPage();
  }

  return (
    <div>
      <h2>Register employee</h2>
      <form onSubmit={handleSignUp}>
        <label>First name:</label>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />

        <label>Last name:</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />

        <label>Email address:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:</label>
        <input type="password" name="password" value={password.password} onChange={handlePasswordChange} required />

        <label>Confirm password</label>
        <input type="password" name="confirmPassword" value={password.confirmPassword} onChange={handlePasswordChange} required />

        <label htmlFor='hr-checkbox'>Give HR permissions</label>
        <input type='checkbox' id='hr-checkbox' onChange={() => setHrPermission(true)} />

        <button type="submit">Register</button>
      </form>
      <div className="toggle-link">
        <p><button onClick={handleToggle}>Back to clockin page</button></p>
      </div>
    </div>
  );
}

export default Register;
