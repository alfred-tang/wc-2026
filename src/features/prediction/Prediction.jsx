import PotSearch from "./components/PotSearch/PotSearch";
import usePots from "./hooks/usePots";

import "./Prediction.css";

function Prediction() {
    const { pots, error, loading } = usePots();

    if (loading) return <p>Loading pots...</p>;
    if (error) return <p>{error}</p>;

    return (
        <PotSearch pots={pots} />
    );
}

export default Prediction;
