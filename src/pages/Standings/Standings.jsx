import StandingContainer from "../../components/Standings/StandingContainer/StandingContainer";

import useStandings from "../../hooks/useStandings";
import useMatches from "../../hooks/useMatches";

import "./Standings.css";

function Standings() {
    const { standings, error: standingsError, loading: standingsLoading } = useStandings();
    const { matches, error: matchesError, loading: matchesLoading } = useMatches();

    if (standingsLoading || matchesLoading) return <p>Loading standings...</p>;

    if (standingsError) return <p>{standingsError}</p>;
    if (matchesError) return <p>{matchesError}</p>

    return (
        <StandingContainer standings={standings} matches={matches} />
    );
}

export default Standings;
