import { memo } from "react";

import "./PotTeam.css";

function PotTeam({ team, owner, disabled }) {
    return (
        <div
            className={`pot-team transparent-card pot-${team.flag} ${disabled ? "disabled" : ""}`}
            style={{
                "--color-hover": `var(--team-${team.flag})`,
            }}
        >
            <img
                src={`/assets/team/${team.flag}-logo.svg`}
                alt={team.name}
                loading="lazy"
            />
            <div>
                {team.name}{" "}
                {owner && (
                    <small>(Owned by: {owner.username})</small>
                )}
            </div>
        </div>
    );
}

export default memo(PotTeam);
