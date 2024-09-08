import React, { useState } from 'react';

function SignIn({ onToggle, onSignUp }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    // Logic for sign-in validation (currently basic)
    if (username && password) {
      onToggle(); // Move to clock-in page
    } else {
      alert('Please enter a valid username and password.');
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Sign In</button>
      </form>
      <div className="toggle-link">
        <p>Don't have an account? <button onClick={onSignUp}>Sign Up</button></p>
      </div>
    </div>
  );
}

export default SignIn;
