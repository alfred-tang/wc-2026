import Loading from "../../components/layout/Loading/Loading";
import Map from "./components/Map/Map";

import useStadiums from "./hooks/useStadiums";

import "./Stadiums.css";

function Stadiums() {
    const { stadiums, error, loading } = useStadiums();

    if (loading) return <Loading />;
    if (error) return <p>{error}</p>;

    return (
        <Map stadiums={stadiums} />
    );
}

export default Stadiums;
