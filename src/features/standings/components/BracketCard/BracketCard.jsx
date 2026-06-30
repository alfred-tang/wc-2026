import { memo, useCallback, useMemo } from "react";

import {
    getPlaceholder,
    getRunnerUpPlaceholder,
} from "../Bracket/bracketProgression";

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

    const showPenalty =
        match.stage !== "First Stage" &&
        match.home_score != null &&
        match.away_score != null &&
        match.home_score === match.away_score &&
        match.home_discipline != null &&
        match.away_discipline != null;

    const homeWon = showPenalty
        ? match.home_discipline > match.away_discipline
        : match.home_score > match.away_score;

    const awayWon = showPenalty
        ? match.away_discipline > match.home_discipline
        : match.away_score > match.home_score;

    const placeholderGetter =
        match.match_order === 103
            ? getRunnerUpPlaceholder
            : getPlaceholder;

    const homeLabel =
        match.home_info?.short_name?.toUpperCase() ??
        placeholderGetter(match.match_order, "home_team");

    const awayLabel =
        match.away_info?.short_name?.toUpperCase() ??
        placeholderGetter(match.match_order, "away_team");

    return (
        <div ref={setMatchRef} className="match-wrapper">
            <div className="match-header">M{match.match_order}</div>
            <div className={`match-card ${large ? "large" : ""}`}>
                <div className="match-date">
                    <span>{date}</span>
                    <span>{time}</span>
                </div>

                <div
                    className={`team-wrapper home-team ${match.home_info?.short_name ? "" : "disabled"
                        }`}
                >
                    <div
                        className={`team ${homeWon ? "winner" : awayWon ? "loser" : ""}`}
                    >
                        <div className="team-container">
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
                            <span>{homeLabel}</span>
                        </div>

                        <div className="team-score">
                            {showPenalty && (
                                <span className="penalty-score">({match.home_discipline})</span>
                            )}
                            <span
                                className={`score ${homeWon ? "winner" : awayWon ? "loser" : ""}`}
                            >
                                {match.home_score ?? ""}
                            </span>
                        </div>
                    </div>

                    <div className="team-fullname">{match?.home_info?.name}</div>
                </div>

                <div
                    className={`team-wrapper away-team ${match.away_info?.short_name ? "" : "disabled"
                        }`}
                >
                    <div
                        className={`team ${awayWon ? "winner" : homeWon ? "loser" : ""}`}
                    >
                        <div className="team-container">
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
                            <span>{awayLabel}</span>
                        </div>

                        <div className="team-score">
                            {showPenalty && (
                                <span className="penalty-score">({match.away_discipline})</span>
                            )}
                            <span
                                className={`score ${awayWon ? "winner" : homeWon ? "loser" : ""}`}
                            >
                                {match.away_score ?? ""}
                            </span>
                        </div>
                    </div>

                    <div className="team-fullname">{match?.away_info?.name}</div>
                </div>
            </div>
        </div>
    );
}

export default memo(BracketCard);
