import { useEffect, useState } from "react";
import Record from "./Record";
import LoadingSpinner from "./LoadingSpinner";
import { FaArrowLeft, FaFilter } from 'react-icons/fa'; // Import back arrow icon
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
                });
                const responseRecords = await response.json();
                setRecords(responseRecords.employeeRecords);
            } catch (e) {
                handleMessage(e, 'error');
            } finally {
                setIsLoading(false);
            }
        };

        const getAllRecords = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${backendUrl}/hr/all-records`, {
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                const responseRecords = await response.json();
                setRecords(responseRecords.employeesRecords);
            } catch (e) {
                handleMessage(e, 'error');
            } finally {
                setIsLoading(false);
            }
        };

        if (isHr && showAllRecords) {
            getAllRecords();
        } else {
            getRecords();
        }
    }, [employeeId, showAllRecords, isHr, handleMessage]);

    const handleFilter = (e) => {
        setEmployeeIdToFilter(e.target.value);
    };

    if (isLoading) {
        return <LoadingSpinner isLoading={isLoading} message={"Getting Records..."} />;
    }

    return (
        <>
            <div className="toggle-link">
                <button className="back-button" onClick={() => changePage('ClockInOut')}>
                    <FaArrowLeft className="back-icon" /> Back to Clock In/Out Page
                </button>
            </div>
            <h2>Employee Clock-In Records</h2>
            {isHr && showAllRecords && (
                <div className="filter-container">
                    <label htmlFor="employee-dropdown">
                        <FaFilter className="filter-icon" />Filter By Employee
                    </label>
                    <select id="employee-dropdown" className="filter-dropdown" defaultValue="" onChange={handleFilter}>
                        <option value="">All Employees</option>
                        {records.reduce((acc, current) => {
                            const x = acc.find((record) => record.employeeId === current.employeeId);
                            if (!x) { acc.push(current); }
                            return acc;
                        }, [])
                            .map((record) =>
                                <option key={record.employeeId} value={record.employeeId}>{record.fullName}</option>
                            )}
                    </select>
                </div>
            )}
            <ul className="list-container">
                {records.length === 0 && <p className="no-records">No clock-in records available.</p>}
                {!employeeIdToFilter ? records.map((record, index) => (
                    <li key={record.entryId} className="list-item">
                        <span className="entry-title">Clock-in Entry #{index + 1}:</span>
                        <Record recordDetails={record} />
                    </li>
                )) :
                    records.filter((record) =>
                        record.employeeId.toString() === employeeIdToFilter)
                        .map((record, index) => (
                            <li key={record.entryId} className="list-item">
                                <span className="entry-title">Clock-in Entry #{index + 1}:</span>
                                <Record recordDetails={record} />
                            </li>
                        ))
                }
            </ul>
        </>
    );
};

export default Records;
