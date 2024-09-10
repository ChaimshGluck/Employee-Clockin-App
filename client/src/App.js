import { useState } from 'react';
import LogIn from './components/Login';
import Register from './components/Register';
import ClockInOut from './components/ClockInOut';
import Records from './components/Records';

function App() {
  const [currentPage, setCurrentPage] = useState('LogIn');
  const [isHr, setIsHr] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
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
      />}
      {currentPage === 'clockInOut' && <ClockInOut
        onToggle={handleToggle}
        isHr={isHr}
        employeeId={employeeId}
        setShowAllRecords={setShowAllRecords}
      />}
      {currentPage === 'Records' && <Records
        onToggle={() => handleToggle('clockInOut')}
        employeeId={employeeId}
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
