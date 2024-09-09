import React, { useState } from 'react';

function ClockInOut() {
  const [clockedIn, setClockedIn] = useState(false);

  const handleClockIn = () => {
    alert('Clocked In!');
    setClockedIn(true);
  };

  const handleClockOut = () => {
    alert('Clocked Out!');
    setClockedIn(false);
  };

  return (
    <div>
      <h2>Clock In/Out</h2>
      {!clockedIn ? (
        <button onClick={handleClockIn}>Clock In</button>
      ) : (
        <button onClick={handleClockOut}>Clock Out</button>
      )}
    </div>
  );
}

export default ClockInOut;
