import { PiMapPinFill } from "react-icons/pi";

import { useIsMobile } from "../../../../hooks/useIsMobile";

import { months } from "../../../../utils/helpers";

import "./MatchRow.css";

const placeholderFlag = "/assets/team/shield-logo.png";

const MatchRow = ({ match, selected, onEdit }) => {
    const {
        match_order,
        stage,
        kick_off,
        stadiums,
        home_info,
        home_score,
        home_discipline,
        away_info,
        away_score,
        away_discipline,
    } = match;
    const matchDate = new Date(kick_off);
    const now = new Date();

    const date = matchDate.getDate();
    const month = months[matchDate.getMonth()];
    const year = matchDate.getFullYear();
    const hour = matchDate.getHours().toString().padStart(2, "0");
    const minute = matchDate.getMinutes().toString().padStart(2, "0");

    const isMobile = useIsMobile();

    let matchDisplay;

    if (now < matchDate) {
        matchDisplay = `${hour}:${minute}`;
    } else if (home_score == null || away_score == null) {
        matchDisplay = "LIVE";
    } else {
        matchDisplay = `${home_score} - ${away_score}`;
    }

    const showPenalty =
        stage !== "First Stage" &&
        home_score != null &&
        away_score != null &&
        home_score === away_score &&
        home_discipline != null &&
        away_discipline != null;

    return (
        <div
            className="match-row transparent-card"
            onClick={() => {
                if (new Date() >= matchDate) {
                    onEdit(match);
                }
            }}
        >
            <div className="match-extra">
                {selected === "Stage" ? (
                    <>
                        <span>Match {match_order}</span>
                        <span>·</span>
                        <span>{`${date} ${month} ${year}`}</span>
                    </>
                ) : (
                    <>
                        <span>{stage}</span>
                        {stage === "First Stage" ? (
                            <>
                                <span>·</span>
                                <span>Group {home_info?.stage}</span>
                            </>
                        ) : null}
                    </>
                )}
            </div>
            <div className="score-line">
                <div className="team-name home">
                    <span>{isMobile ? home_info?.short_name.toUpperCase() : home_info?.name}</span>
                    <div className="flag-container" style={{ "--flag-width": "48px" }}>
                        <img
                            src={
                                home_info?.flag
                                    ? `https://flagcdn.com/h120/${home_info.flag}.png`
                                    : placeholderFlag
                            }
                            srcSet={
                                home_info?.flag
                                    ? `https://flagcdn.com/h240/${home_info.flag}.png 2x`
                                    : undefined
                            }
                            alt={home_info?.name}
                            loading="lazy"
                        />
                    </div>
                </div>
                <div className="match-time">
                    {home_score !== null && away_score !== null ? (
                        <>
                            {showPenalty && (
                                <span className="penalty-score">
                                    ({home_discipline})
                                </span>
                            )}

                            <span
                                className={`score ${home_score > away_score ||
                                        (showPenalty && home_discipline > away_discipline)
                                        ? "winner"
                                        : home_score < away_score ||
                                            (showPenalty && home_discipline < away_discipline)
                                            ? "loser"
                                            : ""
                                    }`}
                            >
                                {home_score}
                            </span>

                            <span className="score-separator">-</span>

                            <span
                                className={`score ${away_score > home_score ||
                                        (showPenalty && away_discipline > home_discipline)
                                        ? "winner"
                                        : away_score < home_score ||
                                            (showPenalty && away_discipline < home_discipline)
                                            ? "loser"
                                            : ""
                                    }`}
                            >
                                {away_score}
                            </span>

                            {showPenalty && (
                                <span className="penalty-score">
                                    ({away_discipline})
                                </span>
                            )}
                        </>
                    ) : (
                        matchDisplay
                    )}
                </div>
                <div className="team-name away">
                    <div className="flag-container" style={{ "--flag-width": "48px" }}>
                        <img
                            src={
                                away_info?.flag
                                    ? `https://flagcdn.com/h120/${away_info.flag}.png`
                                    : placeholderFlag
                            }
                            srcSet={
                                away_info?.flag
                                    ? `https://flagcdn.com/h240/${away_info.flag}.png 2x`
                                    : undefined
                            }
                            alt={away_info?.name}
                            loading="lazy"
                        />
                    </div>
                    <span>{isMobile ? away_info?.short_name.toUpperCase() : away_info?.name}</span>
                </div>
            </div>
            <div className="match-stadium">
                <PiMapPinFill />
                {stadiums.name} ({stadiums.state_province})
            </div>
        </div>
    );
};

export default MatchRow;
