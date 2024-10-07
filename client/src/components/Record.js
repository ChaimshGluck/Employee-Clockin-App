import { FaUser, FaIdBadge, FaClock, FaSignInAlt, FaSignOutAlt, FaHourglassHalf } from 'react-icons/fa';

const Record = ({ recordDetails }) => {

    return (
        <div className="record-card">
            {recordDetails.employeeId &&
                <p className="record-detail">
                    <FaIdBadge className="record-icon" />
                    <span className="record-label">Employee ID:</span>
                    <span className="record-value">#{recordDetails.employeeId}</span>
                </p>
            }

            {recordDetails.fullName &&
                <p className="record-detail">
                    <FaUser className="record-icon" />
                    <span className="record-label">Employee Name:</span>
                    <span className="record-value">{recordDetails.fullName}</span>
                </p>
            }

            <p className="record-detail">
                <FaSignInAlt className="record-icon" />
                <span className="record-label">Clocked In:</span>
                <span className="record-value">{new Date(recordDetails.clockIn).toLocaleString()}</span>
            </p>

            <p className="record-detail">
                {recordDetails.clockOut ? (
                    <>
                        <FaSignOutAlt className="record-icon" />
                        <span className="record-label">Clocked Out:</span>
                        <span className="record-value">{new Date(recordDetails.clockOut).toLocaleString()}</span>
                    </>
                ) : (
                    <>
                        <FaClock className="record-icon" />
                        <span className="record-label">Clocked Out:</span>
                        <span className="record-value">Still clocked in</span>
                    </>
                )}
            </p>

            {recordDetails.totalHours &&
                <p className="record-detail">
                    <FaHourglassHalf className="record-icon" />
                    <span className="record-label">Total Hours Worked:</span>
                    <span className="record-value">{recordDetails.totalHours}</span>
                </p>
            }
        </div>
    )
}

export default Record;