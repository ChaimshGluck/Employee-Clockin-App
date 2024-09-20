import { useEffect } from "react";
import Logout from "./Logout";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function ClockInOut({ isHr, fetchUserRole, changePage, employeeId, fullName, setShowAllRecords }) {

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

  const handleShowAllRecords = (showAll) => {
    localStorage.setItem('showAllRecords', showAll);
    setShowAllRecords(showAll);
  }

  return (
    <div>
      <h2>Hello {fullName}</h2>
      <h2>Clock In/Out</h2>
      <button onClick={handleClockIn}>Clock In</button>
      <button onClick={handleClockOut}>Clock Out</button>
      <p className="toggle-link"><button onClick={() => { changePage('Records'); handleShowAllRecords(false) }}>See all your clockin records</button></p>
      {isHr && <div className="toggle-link">
        <p><button onClick={() => changePage('Register')}>Register new employee</button></p>
        <p><button onClick={() => { changePage('Records'); handleShowAllRecords(true) }}>See all clockin records</button></p>
        <p><button onClick={() => changePage('Employees')}>See all employees</button></p>
      </div>}
      <Logout />
    </div>
  );
}

export default ClockInOut;
