import { useState, useEffect } from "react";

import "./MatchEdit.css";

function MatchEdit({ match, onSave, onClose }) {
    const [homeScore, setHomeScore] = useState("");
    const [awayScore, setAwayScore] = useState("");

    const [homeDiscipline, setHomeDiscipline] = useState("");
    const [awayDiscipline, setAwayDiscipline] = useState("");

    useEffect(() => {
        if (!match) return;

        setHomeScore(match.home_score ?? "");
        setAwayScore(match.away_score ?? "");

        setHomeDiscipline(match.home_discipline ?? "");
        setAwayDiscipline(match.away_discipline ?? "");
    }, [match]);

    if (!match) return null;

    const isKnockout = match.stage !== "First Stage";
    const isDraw =
        homeScore !== "" &&
        awayScore !== "" &&
        Number(homeScore) === Number(awayScore);

    return (
        <div className="match-edit">
            <h2>
                {match.home_info?.name} vs {match.away_info?.name}
            </h2>

            <div className="edit-section">
                <h3>Score</h3>

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
            </div>

            <div className="edit-section">
                <h3>{isKnockout && isDraw ? "Penalty Shootout" : "Discipline"}</h3>

                <div className="score-inputs">
                    <input
                        type="number"
                        min="0"
                        value={homeDiscipline}
                        onChange={(e) => setHomeDiscipline(e.target.value)}
                    />

                    <span>-</span>

                    <input
                        type="number"
                        min="0"
                        value={awayDiscipline}
                        onChange={(e) => setAwayDiscipline(e.target.value)}
                    />
                </div>
            </div>

            <div className="actions">
                <button
                    className="save-btn"
                    onClick={() =>
                        onSave(
                            match.match_id,
                            Number(homeScore),
                            Number(awayScore),
                            Number(homeDiscipline),
                            Number(awayDiscipline),
                        )
                    }
                >
                    Save
                </button>

                <button className="cancel-btn" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default MatchEdit;
