import { useState, createContext } from 'react';
import LogIn from './components/Login';
import Register from './components/Register';
import ClockInOut from './components/ClockInOut';
import Records from './components/Records';
import Employees from './components/Employees';
import UpdateEmployee from './components/UpdateEmployee';

export const EmployeeContext = createContext();

function App() {
  const [currentPage, setCurrentPage] = useState('LogIn');
  const [employeeId, setEmployeeId] = useState(null);
  const [fullName, setFullName] = useState('');
  const [isHr, setIsHr] = useState(false);
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [employeeIdToUpdate, setEmployeeIdToUpdate] = useState(0);


  return (
    <div className="container">

      {currentPage === 'LogIn' && <LogIn
        setCurrentPage={() => setCurrentPage('ClockInOut')}
        setIsHr={setIsHr}
        setEmployeeId={setEmployeeId}
        setFullName={setFullName}
      />}

      {currentPage === 'ClockInOut' && <ClockInOut
        setCurrentPage={setCurrentPage}
        isHr={isHr}
        employeeId={employeeId}
        fullName={fullName}
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
