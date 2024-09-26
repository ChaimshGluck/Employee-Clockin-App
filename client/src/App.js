import { useState, createContext, useEffect, useRef } from 'react';
import LogIn from './components/Login';
import Register from './components/Register';
import ClockInOut from './components/ClockInOut';
import Records from './components/Records';
import Employees from './components/Employees';
import UpdateEmployee from './components/UpdateEmployee';
const backendUrl = window.location.hostname === process.env.REACT_APP_DOMAIN_NAME
  ? process.env.REACT_APP_BACKEND_DOMAIN
  : process.env.REACT_APP_BACKEND_URL;

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
  const [employeeIdToUpdate, setEmployeeIdToUpdate] = useState(() => {
    return localStorage.getItem('employeeIdToUpdate') || null
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const timeoutRef = useRef(null);

  const tokenIsValid = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false
    };

    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp > currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
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
    if (!tokenIsValid()) {
      localStorage.clear();
      setCurrentPage('LogIn');
    }
  }, []);

  useEffect(() => {
    if (message) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setMessage(null);
        timeoutRef.current = null;
      }, 6000)

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    }
  }, [message])

  useEffect(() => {
    setMessage(null);
  }, [currentPage]);

  const handleMessage = (message, type) => {
    setMessage(message);
    setMessageType(type);
  }

  const changePage = (page) => {
    if (tokenIsValid()) {
      localStorage.setItem('currentPage', page);
      setCurrentPage(page);
    } else {
      localStorage.clear();
      setCurrentPage('LogIn');
    }
  }

  return (
    <div className="container">

      {currentPage === 'LogIn' && <LogIn
        changePage={changePage}
        setIsHr={setIsHr}
        setEmployeeId={setEmployeeId}
        setFullName={setFullName}
        fetchUserRole={fetchUserRole}
        handleMessage={handleMessage}
        backendUrl={backendUrl}
      />}

      {currentPage === 'ClockInOut' && <ClockInOut
        changePage={changePage}
        isHr={isHr}
        employeeId={employeeId}
        fullName={fullName}
        setShowAllRecords={setShowAllRecords}
        fetchUserRole={fetchUserRole}
        handleMessage={handleMessage}
        backendUrl={backendUrl}
      />}

      {currentPage === 'Records' &&
        <Records
          changePage={changePage}
          employeeId={employeeId}
          isHr={isHr}
          showAllRecords={showAllRecords}
          fetchUserRole={fetchUserRole}
          handleMessage={handleMessage}
          backendUrl={backendUrl}
        />}

      {currentPage === 'Register' &&
        <Register
          changePage={changePage}
          handleMessage={handleMessage}
          backendUrl={backendUrl}
        />
      }

      {currentPage === 'Employees' &&
        <EmployeeContext.Provider value={setEmployeeIdToUpdate}>
          <Employees
            changePage={changePage}
            handleMessage={handleMessage}
            backendUrl={backendUrl}
          />
        </EmployeeContext.Provider>}

      {currentPage === 'UpdateEmployee' &&
        <EmployeeContext.Provider value={employeeIdToUpdate}>
          <UpdateEmployee
            changePage={changePage}
            handleMessage={handleMessage}
            backendUrl={backendUrl}
          />
        </EmployeeContext.Provider>}

      {message && <div className={`snackbar show ${messageType}`}>{message}</div>}

    </div >
  );
}

export default App;
