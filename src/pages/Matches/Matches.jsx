import MatchContainer from "../../components/Matches/MatchContainer/MatchContainer";
import useMatches from "../../hooks/useMatches";

import "./Matches.css";

function Matches() {

    const { matches, error, loading, updateMatchScore } = useMatches();

    if (loading) return <p>Loading matches...</p>;
    if (error) return <p>{error}</p>;

    return (
        <MatchContainer matches={matches} updateMatchScore={updateMatchScore} />
    );
}

export default Matches;