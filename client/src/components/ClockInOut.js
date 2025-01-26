import { useCallback, useEffect, useState } from "react";
import Logout from "./Logout";
import { fetchFromBackend } from "../utils/api";

function ClockInOut({ currentUser, isHr, fetchUserRole, changePage, setShowAllRecords, handleMessage, isClockedIn, setIsClockedIn, clockInTime, setClockInTime }) {

  const getClockInDuration = useCallback(() => {
    if (!clockInTime) {
      return null;
    }

    const clockInDate = new Date(clockInTime);
    if (isNaN(clockInDate)) {
      return null;
    }

    const now = new Date();
    const duration = now - clockInDate;

    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const seconds = Math.floor((duration / 1000) % 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [clockInTime]);

  const [duration, setDuration] = useState(getClockInDuration());

  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole, isHr]);

  useEffect(() => {
    if (isClockedIn) {
      const intervalId = setInterval(() => {
        setDuration(getClockInDuration());
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isClockedIn, clockInTime, getClockInDuration]);

  if (!currentUser || isHr === null) {
    return <p>Loading employee data...</p>;
  }

  const handleClock = async (inOrOut) => {
    try {
      const response = await fetchFromBackend(`/employee/clock${inOrOut}?employeeId=${currentUser.employeeId}`, 'include', inOrOut === 'in' ? 'POST' : 'PATCH');

      if (!response.ok) {
        throw new Error(response.message);

      } else {
        localStorage.setItem('isClockedIn', !isClockedIn);
        setIsClockedIn(!isClockedIn);

        if (inOrOut === 'in') {
          localStorage.setItem('clockInTime', new Date().toLocaleString());
          setClockInTime(new Date().toLocaleString());
          setDuration('00:00:00');
        } else {
          localStorage.removeItem('clockInTime');
          setClockInTime(null);
          setDuration(null);
        }

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
      <h2>Welcome, {currentUser.fullName}</h2>
      {isClockedIn ?
        <div>
          <h3>You are currently clocked in.</h3>
          <h2 className="clock" >{duration}</h2>
          <button onClick={() => handleClock('out')}>Clock Out</button>
        </div> :
        <div>
          <h3>You are currently clocked out.</h3>
          <button onClick={() => handleClock('in')}>Clock In</button>
        </div>
      }

      <div className="toggle-link">
        <p><button onClick={() => { changePage('Records'); handleShowAllRecords(false) }}>View your clock-in records</button></p>
        <p><button onClick={() => changePage('Profile')}>View your profile</button></p>
      </div>

      {isHr && <div className="toggle-link hr-section">
        <h2>HR Section</h2>
        <p><button onClick={() => changePage('Register')}>Register a new employee</button></p>
        <p><button onClick={() => { changePage('Records'); handleShowAllRecords(true) }}>View all clock-in records</button></p>
        <p><button onClick={() => changePage('Employees')}>View all employees</button></p>
      </div>}
      <Logout />
    </div>
  );
}

export default ClockInOut;
