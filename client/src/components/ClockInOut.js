import { useEffect } from "react";
import Logout from "./Logout";
import { fetchFromBackend } from "../utils/api";
import AppTitle from "./AppTitle";

function ClockInOut({ isHr, fetchUserRole, changePage, employeeId, fullName, setShowAllRecords, handleMessage }) {

  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole, isHr]);

  if (!employeeId || !fullName || isHr === null) {
    return <p>Loading employee data...</p>;
  }

  const handleClock = async (inOrOut) => {
    try {
      const response = await fetchFromBackend(`/employee/clock${inOrOut}?employeeId=${employeeId}`, 'include', inOrOut === 'in' ? 'POST' : 'PATCH');

      if (!response.ok) {
        if (response.message.startsWith('You are')) {
          console.log(response.message);
          handleMessage(response.message, 'error');
          return;
        }
        throw new Error(response.message);

      } else {
        handleMessage(`Clocked ${inOrOut === 'in' ? 'In' : 'Out'}!`, 'info');
      }
    } catch (error) {
      console.log(error);
      handleMessage(`Error clocking ${inOrOut}`, 'error');
    }
  };

  const handleShowAllRecords = (showAll) => {
    localStorage.setItem('showAllRecords', showAll);
    setShowAllRecords(showAll);
  }

  return (
    <div>
      <AppTitle />
      <h2>Welcome, {fullName}</h2>
      <h2>Clock In / Clock Out</h2>
      <button onClick={() => handleClock('in')}>Clock In</button>
      <button onClick={() => handleClock('out')}>Clock Out</button>
      <p className="toggle-link"><button onClick={() => { changePage('Records'); handleShowAllRecords(false) }}>View your clock-in records</button></p>
      {isHr && <div className="toggle-link">
        <hr className="divider" />
        <p><button onClick={() => changePage('Register')}>Register a new employee</button></p>
        <p><button onClick={() => { changePage('Records'); handleShowAllRecords(true) }}>View all clock-in records</button></p>
        <p><button onClick={() => changePage('Employees')}>View all employees</button></p>
      </div>}
      <Logout />
    </div>
  );
}

export default ClockInOut;
