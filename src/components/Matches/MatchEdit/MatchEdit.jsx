import { useState, useEffect } from "react";

import "./MatchEdit.css";

function MatchEdit({
    match,
    onSave,
    onClose,
}) {
    const [homeScore, setHomeScore] = useState("");
    const [awayScore, setAwayScore] = useState("");

    useEffect(() => {
        if (!match) return;

        setHomeScore(match.home_score ?? "");
        setAwayScore(match.away_score ?? "");
    }, [match]);

    if (!match) return null;

    return (
        <div className="match-edit">
            <h2>
                {match.home_info?.name} vs {match.away_info?.name}
            </h2>

            <div className="score-inputs">
                <input
                    type="number"
                    min="0"
                    value={homeScore}
                    onChange={(e) => setHomeScore(e.target.value)}
                />

                <span>-</span>

                <input
                    type="number"
                    min="0"
                    value={awayScore}
                    onChange={(e) => setAwayScore(e.target.value)}
                />
            </div>

            <div className="actions">
                <button
                    onClick={() =>
                        onSave(
                            match.match_id,
                            Number(homeScore),
                            Number(awayScore),
                        )
                    }
                >
                    Save
                </button>

                <button onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default MatchEdit;