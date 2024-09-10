import { useEffect, useState } from "react";
import Record from "./Record";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Records = ({ onToggle, employeeId, showAllRecords }) => {
    const [records, setRecords] = useState([]);


    useEffect(() => {
        const getRecords = async () => {
            try {
                const response = await fetch(`${backendUrl}/employee/records?employeeId=${employeeId}`, {
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include'
                })
                const responseRecords = await response.json();
                console.log(responseRecords)
                setRecords(responseRecords.employeeRecords)
            } catch (e) {
                alert(e)
            }
        }

        const getAllRecords = async () => {
            try {
                const response = await fetch(`${backendUrl}/hr/employees`, {
                    headers: { "Content-Type": "application/json" }
                })
                const responseRecords = await response.json();
                console.log(responseRecords)
                setRecords(responseRecords.employeesRecords)
            } catch (e) {
                alert(e)
            }
        }
        if (showAllRecords) {
            getAllRecords()
        } else {
            getRecords();
        }
    }, [employeeId, showAllRecords])


    return (
        <>
            <div className="toggle-link">
                <p><button onClick={onToggle}>Back to clockin page</button></p>
            </div>
            <ul>
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