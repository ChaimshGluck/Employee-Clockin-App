import { useState } from 'react';
import LogIn from './components/Login';
import Register from './components/Register';
import ClockInOut from './components/ClockInOut';
import Records from './components/Records';

function App() {
  const [currentPage, setCurrentPage] = useState('LogIn');
  const [employeeId, setEmployeeId] = useState(null);
  const [fullName, setFullName] = useState('');
  const [isHr, setIsHr] = useState(false);
  const [showAllRecords, setShowAllRecords] = useState(false);

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
        setFullName={setFullName}
      />}
      {currentPage === 'clockInOut' && <ClockInOut
        onToggle={handleToggle}
        isHr={isHr}
        employeeId={employeeId}
        fullName={fullName}
        setShowAllRecords={setShowAllRecords}
      />}
      {currentPage === 'Records' && <Records
        onToggle={() => handleToggle('clockInOut')}
        employeeId={employeeId}
        fullName={fullName}
        isHr={isHr}
        showAllRecords={showAllRecords}
      />}
      {currentPage === 'Register' && <Register
        onToggle={() => handleToggle('clockInOut')}
      />}
    </div>
  );
}

export default App;
