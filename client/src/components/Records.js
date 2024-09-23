import { useEffect, useState } from "react";
import Record from "./Record";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Records = ({ isHr, changePage, employeeId, showAllRecords, fetchUserRole, handleMessage }) => {
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [employeeIdToFilter, setEmployeeIdToFilter] = useState('');

    useEffect(() => {
        fetchUserRole();
    }, [fetchUserRole, isHr]);

    useEffect(() => {
        const getRecords = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${backendUrl}/employee/records?employeeId=${employeeId}`, {
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include'
                })
                const responseRecords = await response.json();
                setRecords(responseRecords.employeeRecords)
            } catch (e) {
                handleMessage(e, 'error');
            } finally {
                setIsLoading(false);
            }
        }

        const getAllRecords = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${backendUrl}/hr/all-records`, {
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })
                const responseRecords = await response.json();
                setRecords(responseRecords.employeesRecords)
            } catch (e) {
                handleMessage(e, 'error');
            } finally {
                setIsLoading(false);
            }
        }
        if (isHr && showAllRecords) {
            getAllRecords()
        } else {
            getRecords();
        }
    }, [employeeId, showAllRecords, isHr, handleMessage])

    const handleFilter = (e) => {
        setEmployeeIdToFilter(e.target.value)
    }

    if (isLoading) {
        return <p>Getting records...</p>;
    }

    return (
        <>
            <div className="toggle-link">
                <p><button onClick={() => changePage('ClockInOut')}>Back to Clock In/Out Page</button></p>
            </div>
            {isHr && showAllRecords && <>
                <label htmlFor="employee-dropdown">Filter By Employee</label>
                <select id="employee-dropdown" defaultValue="" onChange={handleFilter}>
                    <option value="">All Employees</option>
                    {records.reduce((acc, current) => {
                        const x = acc.find((record) => record.employeeId === current.employeeId);
                        if (!x) { acc.push(current) };
                        return acc;
                    }, [])
                        .map((record) =>
                            <option key={record.employeeId} value={record.employeeId}>{record.fullName}</option>
                        )}
                </select>
            </>}
            <ul>
                {records.length === 0 && <p>No clock-in records available.</p>}
                {!employeeIdToFilter ? records.map((record) => (
                    <li key={record.entryId}>< Record recordDetails={record} /></li>
                )) :
                    records.filter((record) =>
                        record.employeeId.toString() === employeeIdToFilter)
                        .map((record) =>
                            <li key={record.entryId}>< Record recordDetails={record} /></li>
                        )
                }
            </ul>
        </>
    )
}

export default Records;