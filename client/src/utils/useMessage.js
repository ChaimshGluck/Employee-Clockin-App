import React, { useRef, useEffect, useState } from "react";
import ReactDOMServer from 'react-dom/server';

const useMessage = () => {
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [persistMessage, setPersistMessage] = useState(false);
    const timeoutRef = useRef(null);

    const convertJSXToString = (jsx) => {
        return ReactDOMServer.renderToStaticMarkup(jsx).replace(/<[^>]+>/g, '');
    }

    useEffect(() => {
        if (message) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            const getDurationForMessage = (message) => {
                if (React.isValidElement(message)) {
                    message = convertJSXToString(message);
                }
                return Math.max(3000, message.length * 100);
            }

            const duration = getDurationForMessage(message);

            timeoutRef.current = setTimeout(() => {
                setMessage(null);
                timeoutRef.current = null;
            }, duration)

            return () => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            }
        }
    }, [message])

    useEffect(() => {
        if (!persistMessage) {
            setMessage(null);
        }
    }, [persistMessage]);

    const handleMessage = (message, type, persist = false) => {
        setMessage(message);
        setMessageType(type);
        setPersistMessage(persist);
    }

    return { message, messageType, handleMessage };
}

export default useMessage;