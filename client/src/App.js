import React, { useState, createContext, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import LogIn from './components/Login';
import Register from './components/Register';
import ClockInOut from './components/ClockInOut';
import Records from './components/Records';
import Employees from './components/Employees';
import UpdateEmployee from './components/UpdateEmployee';
import ActivateAccount from './components/ActivateAccount';
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
  const [employeeIdToUpdate, setEmployeeIdToUpdate] = useState(() => {
    return localStorage.getItem('employeeIdToUpdate') || null
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [persistMessage, setPersistMessage] = useState(false);
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

  const convertJSXToString = (jsx) => {
    return ReactDOMServer.renderToStaticMarkup(jsx).replace(/<[^>]+>/g, '');
  }

  useEffect(() => {
    if (message) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      const getDurationForMessage = (message) => {
        if (React.isValidElement(message)) {
          message = convertJSXToString(message);
        }
        return Math.max(3000, message.length * 100);
      }

      const duration = getDurationForMessage(message);
      timeoutRef.current = setTimeout(() => {
        setMessage(null);
        timeoutRef.current = null;
      }, duration)

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    }
  }, [message])

  useEffect(() => {
    if (!persistMessage) {
      setMessage(null);
    }
  }, [currentPage, persistMessage]);

  const handleMessage = (message, type, persist = false) => {
    setMessage(message);
    setMessageType(type);
    setPersistMessage(persist);
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
    <Router>
      <div className="container">
        <Routes>
          <Route path='/employee/activate/:token' element={<ActivateAccount />} />
          <Route path='/' element={
            <>
              {currentPage === 'LogIn' && <LogIn
                changePage={changePage}
                setIsHr={setIsHr}
                setEmployeeId={setEmployeeId}
                setFullName={setFullName}
                fetchUserRole={fetchUserRole}
                handleMessage={handleMessage}
              />}

              {currentPage === 'ClockInOut' && <ClockInOut
                changePage={changePage}
                isHr={isHr}
                employeeId={employeeId}
                fullName={fullName}
                setShowAllRecords={setShowAllRecords}
                fetchUserRole={fetchUserRole}
                handleMessage={handleMessage}
              />}

              {currentPage === 'Records' &&
                <Records
                  changePage={changePage}
                  employeeId={employeeId}
                  isHr={isHr}
                  showAllRecords={showAllRecords}
                  fetchUserRole={fetchUserRole}
                  handleMessage={handleMessage}
                />}

              {currentPage === 'Register' &&
                <Register
                  changePage={changePage}
                  handleMessage={handleMessage}
                  convertJSXToString={convertJSXToString}
                />
              }

              {currentPage === 'Employees' &&
                <EmployeeContext.Provider value={setEmployeeIdToUpdate}>
                  <Employees
                    changePage={changePage}
                    handleMessage={handleMessage}
                  />
                </EmployeeContext.Provider>}

              {currentPage === 'UpdateEmployee' &&
                <EmployeeContext.Provider value={employeeIdToUpdate}>
                  <UpdateEmployee
                    changePage={changePage}
                    handleMessage={handleMessage}
                  />
                </EmployeeContext.Provider>}

              {message && <div className={`snackbar show ${messageType}`}>{message}</div>}
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
