import { useState, createContext, useEffect } from 'react';
// import { Routes, Route } from 'react-router-dom';
import LogIn from './components/Login';
import Register from './components/Register';
import ClockInOut from './components/ClockInOut';
import Records from './components/Records';
import Employees from './components/Employees';
import UpdateEmployee from './components/UpdateEmployee';

export const EmployeeContext = createContext();

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'LogIn'
  });
  // const [currentPage, setCurrentPage] = useState('LogIn');
  const [employeeId, setEmployeeId] = useState(() => {
    return JSON.parse(localStorage.getItem('employee'))?.employeeId || null
  });
  const [fullName, setFullName] = useState(() => {
    return JSON.parse(localStorage.getItem('employee'))?.fullName || ''
  });
  const [isHr, setIsHr] = useState(() => {
    return JSON.parse(localStorage.getItem('employee'))?.role === 'HR' || false
  });
  const [showAllRecords, setShowAllRecords] = useState(() => {
    return localStorage.getItem('showAllRecords') || false
  });
  const [employeeIdToUpdate, setEmployeeIdToUpdate] = useState(0);

  useEffect(() => {
    console.log(currentPage, employeeId, fullName, isHr)
  }, [currentPage, employeeId, fullName, isHr])

  return (
    <div className="container">

      {currentPage === 'LogIn' && <LogIn
        setCurrentPage={setCurrentPage}
        setIsHr={setIsHr}
        setEmployeeId={setEmployeeId}
        setFullName={setFullName}
      />}

      {currentPage === 'ClockInOut' && <ClockInOut
        setCurrentPage={setCurrentPage}
        isHr={isHr}
        setIsHr={setIsHr}
        employeeId={employeeId}
        setEmployeeId={setEmployeeId}
        fullName={fullName}
        setFullName={setFullName}
        setShowAllRecords={setShowAllRecords}
      />}

      {currentPage === 'Records' &&
        <Records
          setCurrentPage={() => setCurrentPage('ClockInOut')}
          employeeId={employeeId}
          fullName={fullName}
          isHr={isHr}
          showAllRecords={showAllRecords}
        />}

      {currentPage === 'Register' &&
        <Register
          setCurrentPage={() => setCurrentPage('ClockInOut')}
        />
      }

      {currentPage === 'Employees' &&
        <EmployeeContext.Provider value={setEmployeeIdToUpdate}>
          <Employees setCurrentPage={setCurrentPage} />
        </EmployeeContext.Provider>}

      {currentPage === 'UpdateEmployee' &&
        <EmployeeContext.Provider value={employeeIdToUpdate}>
          <UpdateEmployee setCurrentPage={setCurrentPage} />
        </EmployeeContext.Provider>}

    </div >
  );
}

export default App;
