import React from 'react';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

function ClockInOut({ isHr, onToggle, employeeId }) {


  const handleClockIn = async () => {
    try {
      const response = await fetch(`${backendUrl}/employee/clockin?employeeId=${employeeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const clockinRecord = await response.json();
      console.log(clockinRecord);
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

      const clockoutRecord = await response.json();
      console.log(clockoutRecord);
      alert('Clocked Out!');
    } catch (error) {
      console.error('Error clocking out:', error);
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Clock In/Out</h2>
      <button onClick={handleClockIn}>Clock In</button>
      <button onClick={handleClockOut}>Clock Out</button>
      {isHr && <div className="toggle-link">
        <p><button onClick={onToggle}>Register new employee</button></p>
      </div>}
    </div>
  );
}

export default ClockInOut;
