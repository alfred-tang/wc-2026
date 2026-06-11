import { useState, useEffect } from "react";

import { lastFive } from "../../../utils/helpers";

import "./StandingTable.css";

const StandingTable = ({ standing }) => {
    const { name, standing_teams } = standing;

    const [sortedData, setSortedData] = useState(standing_teams);

    useEffect(() => {
        const sorted = [...sortedData].sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goals_for - b.goals_against !== a.goals_for - a.goals_against)
                return b.goals_for - b.goals_against - (a.goals_for - a.goals_against);
            if (b.goals_for !== a.goals_for) return b.goals_for - a.goals_for;

            return a.pool - b.pool;
        });

        setSortedData(sorted);
    }, []);

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
                            <td>{team.points}</td>
                            <td>{team.wins}</td>
                            <td>{team.draws}</td>
                            <td>{team.losses}</td>
                            <td>{team.goals_for}</td>
                            <td>{team.goals_against}</td>
                            <td>{team.goals_for - team.goals_against}</td>
                            <td>{team.points}</td>
                            <td>
                                {lastFive(team.form).map((m, i) => (
                                    <span className="form-match" key={i}>
                                        {m}
                                    </span>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StandingTable;
