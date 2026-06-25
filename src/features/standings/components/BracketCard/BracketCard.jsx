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
        <div
            ref={setMatchRef}
            className="match-wrapper"
        >
            <div className="match-header">M{match.match_order}</div>
            <div className={`match-card ${large ? "large" : ""}`}>
                <div className="match-date">
                    <span>{date}</span>
                    <span>{time}</span>
                </div>

                <div className="team">
                    <span>
                        {match.home_info?.short_name || match.home_info?.name || "TBD"}
                    </span>

                    <span>{match.home_score ?? ""}</span>
                </div>

                <div className="team">
                    <span>
                        {match.away_info?.short_name || match.away_info?.name || "TBD"}
                    </span>

                    <span>{match.away_score ?? ""}</span>
                </div>
            </div>
        </div>
    );
}

export default memo(BracketCard);
