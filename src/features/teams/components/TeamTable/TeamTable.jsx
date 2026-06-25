import { useEffect, useState } from "react";

import TeamCard from "../TeamCard/TeamCard";

import {
    PiCaretDownFill,
    PiCaretUpFill,
    PiCaretUpDownFill,
} from "react-icons/pi";

import { sortArray } from "../../../../utils/helpers";
import "./TeamTable.css";

const headers = ["World Ranking", "Team", "Stage", "Region", "Participations"];

const TeamTable = ({ teams }) => {
    const [selectedHeader, setSelectedHeader] = useState(0);
    const [sortConfig, setSortConfig] = useState({ 0: "desc" });
    const [sortedTeams, setSortedTeams] = useState(teams);

    const sortableIndices = [0, 1, 2, 3, 4];

    const handleSort = (index) => {
        const nextOrder = sortConfig[index] === "asc" ? "desc" : "asc";
        const sortedData = sortArray(sortedTeams,
            index === 0 ? "world_ranking" :
                index === 1 ? "name" :
                    index === 2 ? "stage" :
                        index === 3 ? "region" :
                            index === 4 ? "participations" : "",
            nextOrder === "desc"
        );

        setSortedTeams(sortedData);
        setSelectedHeader(index);
        setSortConfig({ [index]: nextOrder });
    }
    
    useEffect(() => {
        handleSort(0); // Initial sort by the first column
    }, []); 

    return (
        <table className="team-table">
            <thead className="align-left">
                <tr>
                    {headers.map((header, index) => (
                        <th
                            key={index}
                            className={selectedHeader === index ? "transparent-card" : ""}
                            onClick={() => handleSort(index)}
                        >
                            <div className="header-wrapper">
                                {header}
                                <span
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    {sortableIndices.includes(index) ? (
                                        selectedHeader === index ? (
                                            sortConfig[index] === "asc" ? (
                                                <PiCaretUpFill />
                                            ) : (
                                                <PiCaretDownFill />
                                            )
                                        ) : (
                                            <PiCaretUpDownFill />
                                        )
                                    ) : (
                                        ""
                                    )}
                                </span>
                            </div>
                        </th>
                    )
                    )}
                </tr>
            </thead>
            <tbody className="align-right">
                {sortedTeams.map((team) => (
                    <TeamCard key={team.team_id} team={team} />
                ))}
            </tbody>
        </table>
    );
};

export default TeamTable;
