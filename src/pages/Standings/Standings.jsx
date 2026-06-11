import StandingContainer from "../../components/Standings/StandingContainer/StandingContainer";
import useStandings from "../../hooks/useStandings";

import "./Standings.css";

function Standings() {
    const { standings, error, loading } = useStandings();

    if (loading) return <p>Loading standings...</p>;
    if (error) return <p>{error}</p>;

    return (
        <StandingContainer standings={standings} />
    );
}

export default Standings;
