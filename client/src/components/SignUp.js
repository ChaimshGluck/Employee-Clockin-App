import React, { useState } from 'react';

function SignUp({ onSignIn }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();
    // Simple sign-up logic
    if (username && email && password) {
      alert('Account created! You can now sign in.');
      onSignIn(); // Go back to sign-in page
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Sign Up</button>
      </form>
      <div className="toggle-link">
        <p>Already have an account? <button onClick={onSignIn}>Sign In</button></p>
      </div>
    </div>
  );
}

export default SignUp;
