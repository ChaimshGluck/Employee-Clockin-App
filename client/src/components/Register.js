import { useState } from 'react';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

function Register({ onToggle }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hrPermission, setHrPermission] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${backendUrl}/hr/register`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          isHr: hrPermission
        })
      })
      alert('Account created!');
      onToggle();
    } catch {
      alert('Error registering employee');
    }
  };

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
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <label htmlFor='hr-checkbox'>Give HR permissions</label>
        <input type='checkbox' id='hr-checkbox' onChange={() => setHrPermission(true)} />

        <button type="submit">Sign Up</button>
      </form>
      <div className="toggle-link">
        <p><button onClick={onToggle}>Back to clockin page</button></p>
      </div>
    </div>
  );
}

export default Register;