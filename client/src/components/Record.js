const Record = ({ recordDetails }) => {

    return (
        <div>
            <p>Entry ID: {recordDetails.entryId}</p>
            {recordDetails.employeeId && <p>Employee ID: {recordDetails.employeeId}</p>}
            {recordDetails.fullName && <p>Employee Name: {recordDetails.fullName}</p>}
            <p>Clocked In: {new Date(recordDetails.clockIn).toLocaleString()}</p>
            <p>Clocked Out: {recordDetails.clockOut ? new Date(recordDetails.clockOut).toLocaleString() : "Still clocked in"} </p>
            {recordDetails.totalHours && <p>Total Hours Worked: {recordDetails.totalHours}</p>}
        </div>
    )
}

export default Record;