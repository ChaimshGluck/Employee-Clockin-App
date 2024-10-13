import { useEffect, useState } from "react";
import Record from "./Record";
import LoadingSpinner from "./LoadingSpinner";
import { FaArrowLeft, FaFilter } from 'react-icons/fa';
import { fetchFromBackend } from "../utils/api";

const Records = ({ isHr, changePage, employeeId, showAllRecords, fetchUserRole, handleMessage }) => {
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [employeeIdToFilter, setEmployeeIdToFilter] = useState('');

    useEffect(() => {
        fetchUserRole();
    }, [fetchUserRole, isHr]);

    useEffect(() => {
        const getRecords = async (endpoint) => {
            setIsLoading(true);
            try {
                const response = await fetchFromBackend(endpoint, 'include');

                if (!response.ok) {
                    throw new Error(response.message);
                }
                setRecords(response.employeeRecords);
            } catch (error) {
                console.error('Error getting clock-in records:', error);
                handleMessage('Error getting clock-in records', 'error');
                changePage('ClockInOut');
            } finally {
                setIsLoading(false);
            }
        };

        const endpoint = isHr && showAllRecords ? '/hr/all-records' : `/employee/records?employeeId=${employeeId}`;
        getRecords(endpoint);
    }, [employeeId, showAllRecords, isHr, handleMessage, changePage]);

    const handleFilter = (e) => {
        setEmployeeIdToFilter(e.target.value);
    };

    if (isLoading) {
        return <LoadingSpinner message={"Getting Records..."} />;
    }

    return (
        <>
            <div className="toggle-link">
                <button className="back-button" onClick={() => changePage('ClockInOut')}>
                    <FaArrowLeft className="back-icon" />Back to Clock In/Out Page
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
