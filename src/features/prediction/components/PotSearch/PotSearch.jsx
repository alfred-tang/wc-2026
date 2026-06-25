import { useState, useEffect, useCallback } from "react";

import {
    PiArrowLeft,
    PiCheckCircle,
    PiPlusCircle,
    PiListBullets,
} from "react-icons/pi";

import useUsers from "../../hooks/useUsers";
import useUserTeams from "../../hooks/useUserTeams";
import useBoardPrice from "../../hooks/useBoardPrice.js";
import useGroupedPots from "../../hooks/useGroupedPots.js";
import useFilteredPots from "../../hooks/useFilteredPots.js";

import Modal from "../../../../components/ui/Modal/Modal.jsx";
import InputField from "../../../../components/ui/InputField/InputField.jsx";
import BoardPrice from "../BoardPrice/BoardPrice.jsx";
import PotContainer from "../PotContainer/PotContainer";

import "./PotSearch.css";

function PotSearch({ pots }) {
    const [fullscreenBoard, setFullscreenBoard] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showEditBanner, setShowEditBanner] = useState(false);
    const [closingBanner, setClosingBanner] = useState(false);
    const [showListModal, setShowListModal] = useState(false);
    const [userName, setUserName] = useState("");

    const {
        debouncedName,
        checkingUser,
        userExists,
        currentUser,
        continueUser,
        clearUser,
    } = useUsers(userName);
    const { teamOwners, userTakenPots, takenTeams, assignTeam, swapTeams, deleteSelection } =
        useUserTeams(currentUser);
    const { groupedUsers, totalSpent } = useBoardPrice(teamOwners, pots);

    const [query, setQuery] = useState("");
    const [showResults, setShowResults] = useState(false);

    const handleContinue = useCallback(async () => {
        const user = await continueUser();

        if (user) {
            setShowResults(true);
        }
    }, [continueUser]);

    const groupedPots = useGroupedPots(pots);

    const filteredPots = useFilteredPots(groupedPots, query);

    useEffect(() => {
        if (editMode) {
            setShowEditBanner(true);
            setClosingBanner(false);
        } else if (showEditBanner) {
            setClosingBanner(true);

            const timer = setTimeout(() => {
                setShowEditBanner(false);
                setClosingBanner(false);
            }, 200); // animation duration

            return () => clearTimeout(timer);
        }
    }, [editMode]);

    return (
        <div className={`pot-search ${showResults ? "show" : ""}`}>
            <div className="prediction-intro">
                <h1>Pick Your World Cup Teams</h1>
                <span>
                    Enter your name, pick team from each pot, and guess the champions of World Cup 2026.
                </span>
            </div>
            <div className="search-header">
                <div className="name-section">
                    <div className="input-wrapper">
                        <InputField
                            value={userName}
                            onChange={setUserName}
                            placeholder="Your name..."
                            className="name-input"
                            onClear={() => {
                                setUserName("");
                                clearUser();
                            }}
                        />
                    </div>

                    <button
                        className="continue-btn"
                        disabled={!debouncedName}
                        onClick={handleContinue}
                        style={{
                            "--status-color": checkingUser
                                ? "slategrey"
                                : userExists
                                    ? "mediumseagreen"
                                    : "steelblue",
                        }}
                    >
                        {!debouncedName && (
                            <>
                                <PiArrowLeft />
                                <span>Input</span>
                            </>
                        )}
                        {checkingUser && "Checking user..."}
                        {!checkingUser && debouncedName && userExists && (
                            <>
                                <PiCheckCircle />
                                <span>Continue</span>
                            </>
                        )}

                        {!checkingUser && debouncedName && userExists === false && (
                            <>
                                <PiPlusCircle />
                                <span>Create</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="search-section">
                    <div
                        className="search-container transparent-card"
                        onClick={() => setShowResults(true)}
                    >
                        <InputField
                            value={query}
                            placeholder="Find your team..."
                            className="search-input search-input-alt"
                            onChange={setQuery}
                            onClear={() => setQuery("")}
                        />
                    </div>
                    <button
                        className="list-btn transparent-card"
                        onClick={() => setShowListModal(true)}
                    >
                        <PiListBullets />
                    </button>
                </div>
            </div>

            <div className="pot-results">
                {Object.keys(filteredPots).length === 0 && <p>No teams found</p>}

                <PotContainer
                    pots={filteredPots}
                    showResults={showResults}
                    setShowResults={setShowResults}
                    currentUser={currentUser}
                    teamOwners={teamOwners}
                    userTakenPots={userTakenPots}
                    takenTeams={takenTeams}
                    assignTeam={assignTeam}
                />
            </div>

            {showEditBanner && (
                <div className={`edit-banner ${closingBanner ? "closing" : ""}`}>
                    Select 2 teams from same pot
                </div>
            )}

            <Modal
                isOpen={showListModal}
                onClose={() => {
                    setEditMode(false)
                    setShowListModal(false)
                }}
                rectProps={{
                    height: "99.7%",
                    rx: "8",
                    ry: "8",
                }}
                className={fullscreenBoard ? "fullscreen" : ""}
            >
                <BoardPrice
                    groupedUsers={groupedUsers}
                    totalSpent={totalSpent}
                    swapTeams={swapTeams}
                    deleteSelection={deleteSelection}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    fullscreenBoard={fullscreenBoard}
                    setFullscreenBoard={setFullscreenBoard}
                />
            </Modal>
        </div>
    );
}

export default PotSearch;
