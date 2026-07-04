import "./Loading.css";

function Loading() {
    return (
        <div className="loading-screen" role="status" aria-live="polite">
            <div className="loading-content">
                <div className="loading-words" aria-hidden="true">
                </div>
            </div>
        </div>
    );
}

export default Loading;
