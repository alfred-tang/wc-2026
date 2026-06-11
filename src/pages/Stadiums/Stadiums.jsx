import Map from "../../components/Stadiums/Map/Map";
import useStadiums from "../../hooks/useStadiums";

import "./Stadiums.css";

function Stadiums() {
    const { stadiums, error, loading } = useStadiums();

    if (loading) return <p>Loading stadiums...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Map stadiums={stadiums} />
    );
}

export default Stadiums;
