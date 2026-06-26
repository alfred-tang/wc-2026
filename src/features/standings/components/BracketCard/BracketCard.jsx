import { memo, useCallback, useMemo } from "react";

import "./BracketCard.css";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
});

function BracketCard({ match, cardId, registerRef, large = false }) {
    const kickoff = match?.kick_off;

    const { date, time } = useMemo(() => {
        if (!kickoff) {
            return { date: "", time: "" };
        }

        const kickoffDate = new Date(kickoff);

        return {
            date: dateFormatter.format(kickoffDate),
            time: timeFormatter.format(kickoffDate),
        };
    }, [kickoff]);

    const setMatchRef = useCallback(
        (el) => {
            registerRef?.(cardId, el);
        },
        [cardId, registerRef],
    );

    if (!match) return null;

    return (
        <div ref={setMatchRef} className="match-wrapper">
            <div className="match-header">M{match.match_order}</div>
            <div className={`match-card ${large ? "large" : ""}`}>
                <div className="match-date">
                    <span>{date}</span>
                    <span>{time}</span>
                </div>

                <div className="team">
                    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                        {match?.home_info?.short_name && (
                            <div
                                className="flag-container"
                                style={{ "--flag-width": "18px" }}
                            >
                                <img
                                    src={`https://flagcdn.com/h120/${match.home_info.flag}.png`}
                                    srcSet={`https://flagcdn.com/h240/${match.home_info.flag}.png 2x`}
                                    alt={match?.home_info?.name}
                                    loading="lazy"
                                />
                            </div>
                        )}
                        <span>
                            {match.home_info?.short_name.toUpperCase() ||
                                match.home_info?.name ||
                                "TBD"}
                        </span>
                    </div>

                    <span>{match.home_score ?? ""}</span>
                </div>

                <div className="team">
                    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                        {match?.away_info?.short_name && (
                            <div
                                className="flag-container"
                                style={{ "--flag-width": "18px" }}
                            >
                                <img
                                    src={`https://flagcdn.com/h120/${match.away_info.flag}.png`}
                                    srcSet={`https://flagcdn.com/h240/${match.away_info.flag}.png 2x`}
                                    alt={match?.away_info?.name}
                                    loading="lazy"
                                />
                            </div>
                        )}
                        <span>
                            {match.away_info?.short_name.toUpperCase() ||
                                match.away_info?.name ||
                                "TBD"}
                        </span>
                    </div>

                    <span>{match.away_score ?? ""}</span>
                </div>
            </div>
        </div>
    );
}

export default memo(BracketCard);
