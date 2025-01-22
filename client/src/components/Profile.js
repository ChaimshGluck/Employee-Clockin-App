import { FaArrowLeft } from "react-icons/fa";
import AppTitle from "./AppTitle";
import Employee from "./Employee";
import { useEffect } from "react";

const Profile = ({ changePage, currentUser, setUpdateType }) => {
    currentUser.role = localStorage.getItem('isHr') === 'true' ? 'HR' : 'Employee';

    useEffect(() => {
        setUpdateType('profile');
        localStorage.setItem('updateType', 'profile');
    }, [setUpdateType]);

    const handleBack = () => {
        changePage('ClockInOut');
        setUpdateType('');
        localStorage.removeItem('updateType');
    };

    return (
        <div>
            <AppTitle />
            <div className="toggle-link">
                <button className="back-button" onClick={handleBack}>
                    <FaArrowLeft className="back-icon" />Back to Clock In/Out Page
                </button>
            </div>
            <h2>Profile Page</h2>
            <ul className="list-container">
                <li key={currentUser.employeeId} className="list-item">
                    <Employee employee={currentUser} changePage={changePage} />
                </li>
            </ul>
        </div>
    );
};

export default Profile;