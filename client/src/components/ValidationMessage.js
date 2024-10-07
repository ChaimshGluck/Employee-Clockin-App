import { AiOutlineExclamationCircle } from "react-icons/ai";

const ValidationMessage = ({ message }) => {
    return (
        <div className="error-message">
            <AiOutlineExclamationCircle className="error-message-icon" />
            {message}
        </div>
    );
}

export default ValidationMessage;