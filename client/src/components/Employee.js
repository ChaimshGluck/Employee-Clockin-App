import { useContext } from "react";
import { EmployeeContext } from "../App";
import { FaUser, FaEnvelope, FaBriefcase, FaCalendarAlt, FaEdit } from 'react-icons/fa';

const Employee = ({ employee, changePage }) => {
    const setEmployeeIdToUpdate = useContext(EmployeeContext);

    return (
        <div className="record-card">
                <p className="record-detail">
                    <FaUser className="record-icon" />
                    <span className="record-label">First Name:</span>
                    <span className="record-value">{employee.firstName}</span>
                </p>

                {employee.lastName &&
                    <p className="record-detail">
                        <FaUser className="record-icon" />
                        <span className="record-label">Last Name:</span>
                        <span className="record-value">{employee.lastName}</span>
                    </p>
                }

                <p className="record-detail">
                    <FaEnvelope className="record-icon" />
                    <span className="record-label">Email:</span>
                    <span className="record-value">{employee.email}</span>
                </p>

                <p className="record-detail">
                    <FaBriefcase className="record-icon" />
                    <span className="record-label">Role:</span>
                    <span className="record-value">{employee.role}</span>
                </p>

                <p className="record-detail">
                    <FaCalendarAlt className="record-icon" />
                    <span className="record-label">Date Hired:</span>
                    <span className="record-value">{new Date(employee.dateHired + 'T00:00:00').toLocaleDateString()}</span>
                </p>
            <button
                className="action-button"
                onClick={() => {
                    changePage('UpdateEmployee');
                    setEmployeeIdToUpdate(employee.employeeId);
                    localStorage.setItem('employeeIdToUpdate', employee.employeeId);
                }}
            >
                <FaEdit className="icon" /> Update Employee Info
            </button>
        </div>
    );
}

export default Employee;