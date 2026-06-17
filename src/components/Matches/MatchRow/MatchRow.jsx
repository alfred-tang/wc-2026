import { PiMapPinFill } from "react-icons/pi";

import { months, dayNames } from "../../../utils/helpers";
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
        away_info,
        away_score,
    } = match;
    const matchDate = new Date(kick_off);
    const now = new Date();

    const date = matchDate.getDate();
    const month = months[matchDate.getMonth()];
    const year = matchDate.getFullYear();
    const hour = matchDate.getHours().toString().padStart(2, "0");
    const minute = matchDate.getMinutes().toString().padStart(2, "0");

    let matchDisplay;

    if (now < matchDate) {
        matchDisplay = `${hour}:${minute}`;
    } else if (home_score == null || away_score == null) {
        matchDisplay = "LIVE";
    } else {
        matchDisplay = `${home_score} - ${away_score}`;
    }

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
                    <span>{home_info?.name}</span>
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
                            <span
                                className={`score ${home_score > away_score ? "winner" : home_score < away_score ? "loser" : ""}`}
                            >
                                {home_score}
                            </span>
                            <span className="score-separator">-</span>
                            <span
                                className={`score ${away_score > home_score ? "winner" : away_score < home_score ? "loser" : ""}`}
                            >
                                {away_score}
                            </span>
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
                    <span>{away_info?.name}</span>
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
