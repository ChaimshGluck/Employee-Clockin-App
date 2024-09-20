import { useState, createContext, useEffect } from 'react';
import LogIn from './components/Login';
import Register from './components/Register';
import ClockInOut from './components/ClockInOut';
import Records from './components/Records';
import Employees from './components/Employees';
import UpdateEmployee from './components/UpdateEmployee';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const EmployeeContext = createContext();

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'LogIn'
  });
  const [employeeId, setEmployeeId] = useState(() => {
    return JSON.parse(localStorage.getItem('employee'))?.employeeId || null
  });
  const [fullName, setFullName] = useState(() => {
    return JSON.parse(localStorage.getItem('employee'))?.fullName || ''
  });
  const [isHr, setIsHr] = useState(() => {
    return JSON.parse(localStorage.getItem('isHr')) || false
  });
  const [showAllRecords, setShowAllRecords] = useState(() => {
    return localStorage.getItem('showAllRecords') === 'true' || false
  });
  const [employeeIdToUpdate, setEmployeeIdToUpdate] = useState(0);

  const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return decodedToken.exp > currentTime;
  };

  const fetchUserRole = async () => {
    try {
      const response = await fetch(`${backendUrl}/hr/user-role`, { credentials: 'include' });
      if (response.ok) {
        setIsHr(true);
        localStorage.setItem('isHr', true);
      } else {
        setIsHr(false);
        localStorage.setItem('isHr', false);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  useEffect(() => {
    if (!isTokenValid()) {
      localStorage.clear();
      setCurrentPage('LogIn');
    }
  }, []);

  const changePage = (page) => {
    localStorage.setItem('currentPage', page);
    setCurrentPage(page);
  }

  return (
    <div className="container">

      {currentPage === 'LogIn' && <LogIn
        changePage={changePage}
        setIsHr={setIsHr}
        setEmployeeId={setEmployeeId}
        setFullName={setFullName}
        fetchUserRole={fetchUserRole}
      />}

      {currentPage === 'ClockInOut' && <ClockInOut
        changePage={changePage}
        isHr={isHr}
        employeeId={employeeId}
        setEmployeeId={setEmployeeId}
        fullName={fullName}
        setFullName={setFullName}
        setShowAllRecords={setShowAllRecords}
        fetchUserRole={fetchUserRole}
      />}

      {currentPage === 'Records' &&
        <Records
          changePage={() => changePage('ClockInOut')}
          employeeId={employeeId}
          isHr={isHr}
          showAllRecords={showAllRecords}
          fetchUserRole={fetchUserRole}
        />}

      {currentPage === 'Register' &&
        <Register
          changePage={() => changePage('ClockInOut')}
        />
      }

      {currentPage === 'Employees' &&
        <EmployeeContext.Provider value={setEmployeeIdToUpdate}>
          <Employees changePage={changePage} />
        </EmployeeContext.Provider>}

      {currentPage === 'UpdateEmployee' &&
        <EmployeeContext.Provider value={employeeIdToUpdate}>
          <UpdateEmployee changePage={changePage} />
        </EmployeeContext.Provider>}

    </div >
  );
}

export default App;
