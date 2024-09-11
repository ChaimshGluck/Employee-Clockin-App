const Record = ({ recordDetails }) => {

    return (
        <div>
            <p>Entry ID: {recordDetails.entryId}</p>
            {recordDetails.employeeId && <p>Employee ID: {recordDetails.employeeId}</p>}
            {recordDetails.fullName && <p>Employee name: {recordDetails.fullName}</p>}
            <p>Clocked in: {new Date(recordDetails.clockIn).toLocaleString()}</p>
            <p>Clocked out: {recordDetails.clockOut ? new Date(recordDetails.clockOut).toLocaleString() : "Still clocked in"} </p>
            {recordDetails.totalHours && <p>Hours worked: {recordDetails.totalHours}</p>}
        </div>
    )
}

export default Record;