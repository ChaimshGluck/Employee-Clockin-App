import BeatLoader from "react-spinners/BeatLoader";
import AppTitle from "./AppTitle";

function LoadingSpinner({ message }) {
    return (
        <div className="loader-container">
            <AppTitle/>
            <BeatLoader
                color={"green"}
                cssOverride={{
                    display: "block",
                    margin: "0 auto",
                    borderColor: "red"
                }}
                size={25}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
            <h3>{message}</h3>
        </div>
    )
}

export default LoadingSpinner;