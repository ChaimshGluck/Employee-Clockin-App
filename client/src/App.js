import { useState, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './components/Login';
import Register from './components/Register';
import ClockInOut from './components/ClockInOut';
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
  const { message, messageType, handleMessage } = useMessage();

  useEffect(() => {
    if (!tokenIsValid()) {
      localStorage.clear();
      setCurrentPage('LogIn');
    }
  }, []);

  const changePage = (page) => {
    if (tokenIsValid()) {
      localStorage.setItem('currentPage', page);
      setCurrentPage(page);
    } else {
      localStorage.clear();
      setCurrentPage('LogIn');
    }
  }

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
