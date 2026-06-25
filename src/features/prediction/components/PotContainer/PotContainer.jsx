import { memo, useState } from "react";
import { PiCaretRightFill, PiXBold } from "react-icons/pi";

import Modal from "../../../../components/ui/Modal/Modal.jsx";
import PotTeam from "../PotTeam/PotTeam.jsx";

import { potNames } from "../../../../utils/helpers.js";

import "./PotContainer.css";

function PotContainer({
    pots,
    showResults,
    setShowResults,
    currentUser,
    teamOwners,
    userTakenPots,
    takenTeams,
    assignTeam,
}) {
    const [selectedResult, setSelectedResult] = useState(null);

    const pickRandomTeam = async (potId) => {
        if (!currentUser) return;

        const availableTeams = pots[potId].filter(
            (team) => !takenTeams.includes(team.team_id),
        );

        if (!availableTeams.length) {
            alert("No teams available");

            return;
        }

        const randomTeam =
            availableTeams[Math.floor(Math.random() * availableTeams.length)];

        const success = await assignTeam(currentUser, randomTeam, potId);

        if (!success) return;

        setSelectedResult({
            team: randomTeam,
            pot: potId,
        });
    };

    return (
        <>
            <div className={`pot-container ${showResults ? "show" : ""}`}>
                {Object.entries(pots).map(([potName, potList], index) => (
                    <div
                        className={`pot ${showResults ? "show" : ""}`}
                        key={potName}
                        style={{
                            transitionDelay: showResults
                                ? `${0.1 + potName * 0.1}s`
                                : `${0.1 + 0.1 * (potList.length - potName - 1)}s`,
                        }}
                    >
                        <div className="pot-header">
                            <h2>{potNames[potName].name}</h2>
                            {index === 0 && (
                                <button
                                    className="close-pots-btn"
                                    onClick={() => setShowResults(false)}
                                >
                                    <PiXBold />
                                </button>
                            )}
                        </div>
                        <button
                            className="pot-teams animated-gradient"
                            disabled={
                                !currentUser ||
                                userTakenPots.includes(Number(potName)) ||
                                potList.every((team) => takenTeams.includes(team.team_id))
                            }
                            onClick={() => pickRandomTeam(potName)}
                        >
                            {potList.map((team) => (
                                <PotTeam
                                    key={team.team_id}
                                    team={team}
                                    owner={teamOwners[team.team_id]}
                                    disabled={takenTeams.includes(team.team_id)}
                                />
                            ))}
                            <PiCaretRightFill className="pot-arrow" />
                        </button>
                    </div>
                ))}
            </div>

            <div
                className={`pot-background transparent-card ${showResults ? "show" : ""}`}
            ></div>

            <Modal
                isOpen={selectedResult}
                onClose={() => setSelectedResult(null)}
                rectProps={{
                    height: "99.4%",
                }}
            >
                <div>
                    <img
                        src={`/assets/team/${selectedResult?.team.flag}-logo.svg`}
                        alt=""
                        style={{ height: "150px" }}
                    />
                    <h1>{currentUser?.username}</h1>
                    <h2>
                        {selectedResult?.team.name} from {potNames[selectedResult?.pot]?.name}
                        !
                    </h2>
                    <p>Price: {potNames[selectedResult?.pot]?.price}k VND</p>
                </div>
            </Modal>
        </>
    );
}

export default memo(PotContainer);
