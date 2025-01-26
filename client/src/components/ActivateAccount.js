import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import LoadingSpinner from "./LoadingSpinner";
import { fetchFromBackend } from "../utils/api";

const ActivateAccount = () => {
    const { token } = useParams();
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const activateAccount = async () => {
            setIsLoading(true);
            try {
                const response = await fetchFromBackend(`/employee/activate/${token}`);
                if (!response.ok) {
                    throw new Error(response.message);
                }
                setMessage('Account activated successfully!');
                setIsSuccess(true);
                setIsLoading(false);
            } catch (error) {
                console.error('Error activating account:', error);
                setMessage(error.message);
                setIsSuccess(false);
                setIsLoading(false);
            }
        };

        activateAccount();
    }, [token]);

    if (isLoading) {
        return <LoadingSpinner message={"Activating your account..."} />
    }

    return (
        <div>
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