import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ActivateAccount = () => {
    const { token } = useParams();
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const activateAccount = async () => {
            try {
                const response = await fetch(`${backendUrl}/employee/activate/${token}`);
                const accountActivated = await response.json();
                if (!accountActivated.ok) {
                    throw new Error(accountActivated.error);
                }
                setMessage('Account activated successfully!');
                setIsSuccess(true);
            } catch (error) {
                setMessage(error.message);
                setIsSuccess(false);
            }
        };

        activateAccount();
    }, [token]);

    return (
        <div>
            <h2 className="page-title">Employee Management System</h2>
            <div className={`message-box ${isSuccess ? 'success' : 'error'}`}>
                {isSuccess ? <AiOutlineCheckCircle className="activation-icon" /> : <AiOutlineWarning className="activation-icon" />}
                <h3>{message}</h3>
            </div>
            {(isSuccess || message === 'Account is already active') && <div className="toggle-link">
                <button onClick={() => navigate('/')}>
                    Log in to your account
                </button>
            </div>}
        </div>
    )
};

export default ActivateAccount;