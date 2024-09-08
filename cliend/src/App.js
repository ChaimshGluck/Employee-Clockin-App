import React, { useState } from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ClockInOut from './components/ClockInOut';

function App() {
  const [currentPage, setCurrentPage] = useState('signIn'); // 'signIn', 'signUp', 'clockInOut'

  // Function to toggle between pages
  const handleToggle = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      {currentPage === 'signIn' && <SignIn onToggle={() => handleToggle('clockInOut')} onSignUp={() => handleToggle('signUp')} />}
      {currentPage === 'signUp' && <SignUp onSignIn={() => handleToggle('signIn')} />}
      {currentPage === 'clockInOut' && <ClockInOut />}
    </div>
  );
}

export default App;
