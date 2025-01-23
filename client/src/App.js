import { useState, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './components/Login';
import Register from './components/Register';
import ClockInOut from './components/ClockInOut';
import Profile from './components/Profile';
import Records from './components/Records';
import Employees from './components/Employees';
import UpdateEmployee from './components/UpdateEmployee';
import ActivateAccount from './components/ActivateAccount';
import useMessage from './utils/useMessage';
import { tokenIsValid } from './utils/utils';
import { fetchFromBackend } from './utils/api';
export const EmployeeContext = createContext();

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'LogIn'
  });
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem('currentUser')) || null
  });
  const [isHr, setIsHr] = useState(() => {
    return JSON.parse(localStorage.getItem('isHr')) || false
  });
  const [showAllRecords, setShowAllRecords] = useState(() => {
    return localStorage.getItem('showAllRecords') === 'true' || false
  });
  const [employeeToUpdate, setEmployeeToUpdate] = useState(() => {
    return JSON.parse(localStorage.getItem('employeeToUpdate')) || null
  });
  const [isClockedIn, setIsClockedIn] = useState(() => {
    return JSON.parse(localStorage.getItem('isClockedIn')) || false
  });
  const [clockInTime, setClockInTime] = useState(() => {
    return localStorage.getItem('clockInTime') || null
  });
  const [updateType, setUpdateType] = useState(() => {
    return localStorage.getItem('updateType') || ''
  });
  const { message, messageType, handleMessage } = useMessage();


  // Check if token is valid and if not, clear local storage and redirect to login page
  useEffect(() => {
    if (!tokenIsValid()) {
      localStorage.clear();
      if (currentPage !== 'LogIn') {
        handleMessage('Session expired. Please log in again.', 'error');
      }
      setCurrentPage('LogIn');
    }
  }, []);

  // Change page and save it to local storage
  const changePage = (page) => {
    if (tokenIsValid()) {
      localStorage.setItem('currentPage', page);
      setCurrentPage(page);
    } else {
      localStorage.clear();
      if (currentPage !== 'LogIn') {
        handleMessage('Session expired. Please log in again.', 'error');
      }
      setCurrentPage('LogIn');
    }
  }

  // Fetch user role from backend and set isHr state
  const fetchUserRole = async () => {
    try {
      const response = await fetchFromBackend(`/hr/user-role`, 'include');
      if (!response.ok) {
        setIsHr(false);
        localStorage.setItem('isHr', false);
        throw new Error(response.error);
      } else {
        setIsHr(true);
        localStorage.setItem('isHr', true);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path='/employee/activate/:token' element={<ActivateAccount />} />
          <Route path='/' element={
            <>
              {currentPage === 'LogIn' && <LogIn
                changePage={changePage}
                setCurrentUser={setCurrentUser}
                setIsHr={setIsHr}
                fetchUserRole={fetchUserRole}
                handleMessage={handleMessage}
                setIsClockedIn={setIsClockedIn}
                setClockInTime={setClockInTime}
              />}

              {currentPage === 'ClockInOut' && <ClockInOut
                changePage={changePage}
                currentUser={currentUser}
                isHr={isHr}
                setShowAllRecords={setShowAllRecords}
                fetchUserRole={fetchUserRole}
                handleMessage={handleMessage}
                isClockedIn={isClockedIn}
                setIsClockedIn={setIsClockedIn}
                clockInTime={clockInTime}
                setClockInTime={setClockInTime}
              />}

              {currentPage === 'Records' &&
                <Records
                  changePage={changePage}
                  currentUser={currentUser}
                  isHr={isHr}
                  showAllRecords={showAllRecords}
                  fetchUserRole={fetchUserRole}
                  handleMessage={handleMessage}
                />}

              {currentPage === 'Profile' &&
                <EmployeeContext.Provider value={setEmployeeToUpdate}>
                  <Profile
                    changePage={changePage}
                    currentUser={currentUser}
                    setUpdateType={setUpdateType}
                  />
                </EmployeeContext.Provider>
              }

              {currentPage === 'Register' &&
                <Register
                  changePage={changePage}
                  handleMessage={handleMessage}
                />
              }

              {currentPage === 'Employees' &&
                <EmployeeContext.Provider value={setEmployeeToUpdate}>
                  <Employees
                    changePage={changePage}
                    handleMessage={handleMessage}
                    setUpdateType={setUpdateType}
                  />
                </EmployeeContext.Provider>}

              {currentPage === 'UpdateEmployee' &&
                <EmployeeContext.Provider value={employeeToUpdate}>
                  <UpdateEmployee
                    changePage={changePage}
                    setCurrentUser={setCurrentUser}
                    handleMessage={handleMessage}
                    updateType={updateType}
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
