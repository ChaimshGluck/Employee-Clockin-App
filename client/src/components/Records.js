import { useEffect, useState } from "react";
import Record from "./Record";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Records = ({ setCurrentPage, employeeId, showAllRecords }) => {
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


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
                setIsLoading(false);
            } catch (e) {
                setIsLoading(false);
                alert(e)
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
                setIsLoading(false);
            } catch (e) {
                setIsLoading(false);
                alert(e)
            }
        }
        if (showAllRecords) {
            getAllRecords()
        } else {
            getRecords();
        }
    }, [employeeId, showAllRecords])

    if (isLoading) {
        return <p>Getting records...</p>;
    }

    return (
        <>
            <div className="toggle-link">
                <p><button onClick={setCurrentPage}>Back to clockin page</button></p>
            </div>
            <ul>
                {records.length === 0 && <p>You have no clockin records</p>}
                {
                    records.map((record, index) => (
                        (
                            <li key={index}>< Record recordDetails={record} /></li>
                        )
                    ))
                }
            </ul>
        </>
    )
}

export default Records;