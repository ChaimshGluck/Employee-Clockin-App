import { useEffect } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function ClockInOut({ isHr, setIsHr, fetchUserRole, setCurrentPage, employeeId, setEmployeeId, fullName, setFullName, setShowAllRecords }) {

  useEffect(() => {
    console.log('test')
    console.log("Employee ID:", employeeId);
    console.log("Full Name:", fullName);
    console.log("isHR:", isHr);
  }, [employeeId, fullName, isHr])

  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole, isHr]);


  if (!employeeId || !fullName || isHr === null) {
    return <p>Loading employee data...</p>;
  }

  const handleClockIn = async () => {
    try {
      const response = await fetch(`${backendUrl}/employee/clockin?employeeId=${employeeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('error data:', errorData)
        throw new Error(errorData.message);
      }

      alert('Clocked In!');
    } catch (error) {
      console.error('Error clocking in:', error);
      alert(error.message);
    }
  };

  const handleClockOut = async () => {
    try {
      const response = await fetch(`${backendUrl}/employee/clockout?employeeId=${employeeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      alert('Clocked Out!');
    } catch (error) {
      console.error('Error clocking out:', error);
      alert(error.message);
    }
  };

  const logout = async () => {
    try {
      localStorage.clear();
      setEmployeeId(null);
      setFullName('');
      setIsHr(false);
      setCurrentPage('LogIn');
      alert('Logged out');
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleToggle = (page) => {
    localStorage.setItem('currentPage', page);
    setCurrentPage(page);
  }

  const handleshowAllRecords = (showAll) => {
    localStorage.setItem('showAllRecords', showAll);
    setShowAllRecords(showAll);
  }

  return (
    <div>
      <h2>Hello {fullName}</h2>
      <h2>Clock In/Out</h2>
      <button onClick={handleClockIn}>Clock In</button>
      <button onClick={handleClockOut}>Clock Out</button>
      <p className="toggle-link"><button onClick={() => { handleToggle('Records'); handleshowAllRecords(false) }}>See all your clockin records</button></p>
      {isHr && <div className="toggle-link">
        <p><button onClick={() => handleToggle('Register')}>Register new employee</button></p>
        <p><button onClick={() => { handleToggle('Records'); handleshowAllRecords(true) }}>See all clockin records</button></p>
        <p><button onClick={() => handleToggle('Employees')}>See all employees</button></p>
      </div>}
      <p><button onClick={logout}>Log out</button></p>
    </div>
  );
}

export default ClockInOut;
