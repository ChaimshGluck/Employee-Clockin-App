import BeatLoader from "react-spinners/BeatLoader";

function LoadingSpinner({isLoading, message}) {
    return (
        <div className="loader-container">
            <BeatLoader
                color={"green"}
                // loading={isLoading}
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