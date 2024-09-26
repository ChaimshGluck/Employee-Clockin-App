import { useState } from 'react';

function Register({ changePage, handleMessage, backendUrl }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
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
          changePage('ClockInOut');
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
      <h2>Register Employee</h2>
      <form onSubmit={handleSignUp}>
        <label htmlFor='fname-register'>First Name:<span className="required">*</span></label>
        <input type="text" id='fname-register' value={firstName} onChange={(e) => setFirstName(e.target.value)} required />

        <label htmlFor='lname-register'>Last Name:</label>
        <input type="text" id='lname-register' value={lastName} onChange={(e) => setLastName(e.target.value)} />

        <label htmlFor='email-register'>Email Address:<span className="required">*</span></label>
        <input type="email" id='email-register' value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor='pass-register'>Password:<span className="required">*</span></label>
        <input
          type={showPassword ? "text" : "password"}
          id='pass-register'
          name="password"
          value={password.password}
          onChange={handlePasswordChange}
          required
        />

        <label htmlFor='confirm-pass-register'>Confirm Password:<span className="required">*</span></label>
        <input
          type={showPassword ? "text" : "password"}
          id='confirm-pass-register'
          name="confirmPassword"
          value={password.confirmPassword}
          onChange={handlePasswordChange}
          required
        />

        <div className="checkbox-container">
          <label htmlFor='password-register-checkbox'>Show Password</label>
          <input
            type='checkbox'
            className='checkbox'
            id='password-register-checkbox'
            onChange={() => setShowPassword(!showPassword)}
          />
        </div>

        <div className="checkbox-container">
          <label htmlFor='hr-checkbox'>Grant HR Permissions</label>
          <input type='checkbox' className='checkbox' id='hr-checkbox' onChange={() => setHrPermission(!hrPermission)} />
        </div>

        <button type="submit">Register</button>
      </form>
      <div className="toggle-link">
        <p><button onClick={changePage}>Back to Clock In/Out Page</button></p>
      </div>
    </div>
  );
}

export default Register;
