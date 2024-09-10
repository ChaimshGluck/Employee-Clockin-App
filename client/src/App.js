import React, { useState } from 'react';
import LogIn from './components/Login';
import Register from './components/Register';
import ClockInOut from './components/ClockInOut';

function App() {
  const [currentPage, setCurrentPage] = useState('LogIn');
  const [isHr, setIsHr] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  // Function to toggle between pages
  const handleToggle = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      {currentPage === 'LogIn' && <LogIn
        onToggle={() => handleToggle('clockInOut')}
        setIsHr={setIsHr}
        setEmployeeId={setEmployeeId}
      />}
      {currentPage === 'clockInOut' && <ClockInOut
        onToggle={isHr ? () => handleToggle('Register') : undefined}
        isHr={isHr}
        employeeId={employeeId}
      />}
      {currentPage === 'Register' && <Register
        onRegister={() => handleToggle('clockInOut')}
      />}
    </div>
  );
}

export default App;
