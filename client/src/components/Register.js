import { useState } from 'react';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

function Register({ changePage, handleMessage }) {
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
      handleMessage('Passwords do not match', 'error');
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
        handleMessage('New Employee Registered!', 'success');
        setTimeout(() => {
          localStorage.setItem('currentPage', 'ClockInOut');
          changePage();
        }, 4000)
      } else {
        handleMessage(result.error, 'error')
      }
    } catch (error) {
      handleMessage('Error Registering Employee', 'error');
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  return (
    <div>
      <h2>Register employee</h2>
      <form onSubmit={handleSignUp}>
        <label>First Name:<span className="required">*</span></label>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />

        <label>Last Name:</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />

        <label>Email Address:<span className="required">*</span></label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:<span className="required">*</span></label>
        <input type="password" name="password" value={password.password} onChange={handlePasswordChange} required />

        <label>Confirm Password:<span className="required">*</span></label>
        <input type="password" name="confirmPassword" value={password.confirmPassword} onChange={handlePasswordChange} required />

        <label htmlFor='hr-checkbox'>Grant HR Permissions</label>
        <input type='checkbox' className='hr-checkbox' onChange={() => setHrPermission(true)} />

        <button type="submit">Register</button>
      </form>
      <div className="toggle-link">
        <p><button onClick={() => changePage('ClockInOut')}>Back to Clock In/Out Page</button></p>
      </div>
    </div>
  );
}

export default Register;
