import { useContext } from "react";
import { EmployeeContext } from "../App";
import { FaUser, FaEnvelope, FaBriefcase, FaCalendarAlt, FaEdit } from 'react-icons/fa';

const Employee = ({ employee, changePage, employees }) => {
    const setEmployeeToUpdate = useContext(EmployeeContext);
    const updateType = localStorage.getItem('updateType');

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
                    const employeeToUpdate = employees ? employees.filter(emp => emp.employeeId === employee.employeeId)[0] : employee;
                    setEmployeeToUpdate(employeeToUpdate);
                    localStorage.setItem('employeeToUpdate', JSON.stringify(employeeToUpdate));
                }}
            >
                <FaEdit className="icon" /> Update {updateType === 'employee' ? 'Employee Info' : 'Profile'}
            </button>
        </div>
    );
}

export default Employee;