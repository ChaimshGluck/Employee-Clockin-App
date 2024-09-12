const backendUrl = process.env.REACT_APP_BACKEND_URL;

function ClockInOut({ isHr, onToggle, employeeId, fullName, setShowAllRecords }) {


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
      <h2>Hello {fullName}</h2>
      <h2>Clock In/Out</h2>
      <button onClick={handleClockIn}>Clock In</button>
      <button onClick={handleClockOut}>Clock Out</button>
      <p className="toggle-link"><button onClick={() => { onToggle('Records'); setShowAllRecords(false) }}>See all your clockin records</button></p>
      {isHr && <div className="toggle-link">
        <p><button onClick={() => onToggle('Register')}>Register new employee</button></p>
        <p><button onClick={() => { onToggle('Records'); setShowAllRecords(true) }}>See all clockin records</button></p>
        <p><button onClick={() => onToggle('Employees')}>See all employees</button></p>
      </div>}
    </div>
  );
}

export default ClockInOut;
