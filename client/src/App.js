import React, { useState } from 'react';
import LogIn from './components/Login';
import Register from './components/Register';
import ClockInOut from './components/ClockInOut';

function App() {
  const [currentPage, setCurrentPage] = useState('LogIn');
  const [isHr, setIsHr] = useState(false);

  // Function to toggle between pages
  const handleToggle = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      {currentPage === 'LogIn' && <LogIn onToggle={() => handleToggle('clockInOut')} setIsHr={setIsHr} />}
      {currentPage === 'clockInOut' && <ClockInOut onToggle={isHr ? () => handleToggle('Register') : undefined} isHr={isHr}/>}
      {/* {isHr && <Register />} */}
      {/* {currentPage === 'Register' && <Register />} */}
      {/* {currentPage === 'signIn' && <SignIn onToggle={() => handleToggle('clockInOut')} onSignUp={() => handleToggle('signUp')} />}
      {currentPage === 'signUp' && <SignUp onSignIn={() => handleToggle('signIn')} />}
      {currentPage === 'clockInOut' && <ClockInOut />} */}
    </div>
  );
}

export default App;
