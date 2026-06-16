import { useState, useEffect, useMemo } from "react";

import { PiMinusCircleFill, PiXCircleFill, PiCheckCircleFill } from "react-icons/pi";
import { lastFive, calculateStandings } from "../../../utils/helpers";

import "./StandingTable.css";

const StandingTable = ({ standing, matches }) => {
    const { name, standing_teams } = standing;

    const groupMatches = matches.filter(
        (match) => match.stage === "First Stage"
    );

    const sortedData = useMemo(() => {
        return calculateStandings(
            standing_teams.map(item => item),
            groupMatches
        );
    }, [standing_teams, groupMatches]);

    return (
        <div className="standing-wrapper transparent-card">
            <table className="standing-table">
                <thead>
                    <tr>
                        <th className="align-left" colSpan={2}>{`Group ${name}`}</th>
                        <th>P</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GF</th>
                        <th>GA</th>
                        <th>GD</th>
                        <th>Pts</th>
                        <th>Form</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((team, index) => (
                        <tr key={team.team_id}>
                            <td className="number-col">{index + 1}</td>
                            <td className="standing-col">
                                <div
                                    className="flag-container"
                                    style={{
                                        "--flag-width": "36px",
                                        margin: "10px 20px 10px 5px",
                                    }}
                                >
                                    <img
                                        style={{ filter: "drop-shadow(0px 0px 1px #333)" }}
                                        src={`https://flagcdn.com/h120/${team.teams.flag}.png`}
                                        srcSet={`https://flagcdn.com/h240/${team.teams.flag}.png 2x`}
                                        alt={team.teams.name}
                                        loading="lazy"
                                    />
                                </div>
                                {team.teams.name}
                            </td>
                            <td>{team.played}</td>
                            <td>{team.wins}</td>
                            <td>{team.draws}</td>
                            <td>{team.losses}</td>
                            <td>{team.goals_for}</td>
                            <td>{team.goals_against}</td>
                            <td>{team.goals_for - team.goals_against}</td>
                            <td>{team.points}</td>
                            <td>
                                <div className="form-list">
                                    {lastFive(team.form).map((result, i) => (
                                        <span
                                            key={i}
                                            className={`form-match ${
                                                result === "W"
                                                    ? "win" : result === "D" ? "draw" : result === "L" ? "loss" : "empty"
                                            }`}
                                        >
                                            {result === "W" && <PiCheckCircleFill/>}
                                            {result === "D" && <PiMinusCircleFill/>}
                                            {result === "L" && <PiXCircleFill/>}
                                            {result === "—" && "—"}
                                        </span>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StandingTable;
