import { useState } from "react";

import Modal from "../../components/Main/Modal/Modal";
import Bracket from "../../components/Standings/Bracket/Bracket";

import StandingContainer from "../../components/Standings/StandingContainer/StandingContainer";

import useStandings from "../../hooks/useStandings";
import useMatches from "../../hooks/useMatches";

import "./Standings.css";

function Standings() {
    const [showBracket, setShowBracket] = useState(false);

    const {
        standings,
        error: standingsError,
        loading: standingsLoading,
    } = useStandings();
    const {
        matches,
        error: matchesError,
        loading: matchesLoading,
    } = useMatches();

    if (standingsLoading || matchesLoading) return <p>Loading standings...</p>;

    if (standingsError) return <p>{standingsError}</p>;
    if (matchesError) return <p>{matchesError}</p>;

    return (
        <>
            {/* <button
                className="bracket-viewer button transparent-card"
                onClick={() => setShowBracket(true)}
            >
                View Bracket
            </button> */}
            <StandingContainer standings={standings} matches={matches} />
            {/* <Modal
                isOpen={showBracket}
                onClose={() => setShowBracket(false)}
                rectProps={{
                    height: "99.4%",
                }}
            >
                <Bracket matches={matches} />
            </Modal> */}
        </>
    );
}

export default Standings;
