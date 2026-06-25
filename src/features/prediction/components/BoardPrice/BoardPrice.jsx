import { memo, useEffect, useState } from "react";

import {
    PiMinusBold,
    PiCheckBold,
    PiXBold,
    PiGearBold,
    PiArrowsOutBold,
    PiArrowsInBold,
} from "react-icons/pi";

import { potNames } from "../../../../utils/helpers";

import "./BoardPrice.css";

function BoardPrice({
    groupedUsers,
    totalSpent,
    swapTeams,
    deleteSelection,
    editMode,
    setEditMode,
    fullscreenBoard,
    setFullscreenBoard,
}) {
    const [pendingDeletes, setPendingDeletes] = useState([]);
    const [pendingSwaps, setPendingSwaps] = useState([]);
    const [selectedSwap, setSelectedSwap] = useState(null);
    const [localUsers, setLocalUsers] = useState(groupedUsers);

    const pendingTeamIds = new Set(
        pendingSwaps.flatMap((swap) => [swap.from.teamId, swap.to.teamId]),
    );

    const highlightedPot = selectedSwap?.pot;

    const swapLocalTeams = (teamA, teamB) => {
        setLocalUsers((prev) =>
            prev.map((user) => ({
                ...user,
                selections: user.selections.map((selection) => {
                    if (selection.teamId === teamA.teamId) {
                        return {
                            ...teamB,
                            username: user.username,
                        };
                    }

                    if (selection.teamId === teamB.teamId) {
                        return {
                            ...teamA,
                            username: user.username,
                        };
                    }

                    return selection;
                }),
            })),
        );
    };

    const handleSwapSelect = (selection, username) => {
        if (!editMode) return;

        const current = {
            ...selection,
            username,
        };

        if (!selectedSwap) {
            setSelectedSwap(current);
            return;
        }

        if (selectedSwap.pot !== current.pot) {
            alert("Can only swap teams from same pot");
            return;
        }

        if (selectedSwap.teamId === current.teamId) {
            setSelectedSwap(null);
            return;
        }

        swapLocalTeams(selectedSwap, current);

        setPendingSwaps((prev) => [
            ...prev,
            {
                from: selectedSwap,
                to: current,
            },
        ]);

        setSelectedSwap(null);
    };

    const handleAccept = async () => {
        for (const swap of pendingSwaps) {
            const success = await swapTeams(swap.from, swap.to);

            if (!success) {
                alert("Failed swap");
                return;
            }
        }

        for (const teamId of pendingDeletes) {
            const success = await deleteSelection(teamId);

            if (!success) {
                alert("Delete failed");
                return;
            }
        }

        setPendingSwaps([]);
        setPendingDeletes([]);
        setSelectedSwap(null);
        setEditMode(false);
    };

    const handleCancel = () => {
        setLocalUsers(groupedUsers);

        setPendingSwaps([]);
        setPendingDeletes([]);
        setSelectedSwap(null);

        setEditMode(false);
    };

    useEffect(() => {
        setLocalUsers(groupedUsers);
    }, [groupedUsers]);

    const handleDeleteSelection = (selection) => {
        if (!editMode) return;

        setPendingDeletes((prev) => [...prev, selection.teamId]);

        setLocalUsers((prev) =>
            prev
                .map((user) => ({
                    ...user,
                    selections: user.selections.filter(
                        (team) => team.teamId !== selection.teamId,
                    ),
                }))
                .filter((user) => user.selections.length > 0),
        );
    };

    return (
        <>
            <div className={`header-board ${fullscreenBoard ? "fullscreen" : ""}`}>
                {!editMode ? (
                    <button
                        className="controller edit-button"
                        onClick={() => setEditMode(true)}
                    >
                        <PiGearBold />
                    </button>
                ) : (
                    <div className="controller edit-controls">
                        <button className="accept-btn" onClick={handleAccept}>
                            <PiCheckBold />
                            <span>
                                {pendingSwaps.length || pendingDeletes.length
                                    ? pendingSwaps.length + pendingDeletes.length
                                    : ""}
                            </span>
                        </button>
                        <button className="cancel-btn" onClick={handleCancel}>
                            <PiXBold />
                        </button>
                    </div>
                )}
                <h2>Board Price</h2>
                <button
                    className="controller full-screen-button"
                    onClick={() => setFullscreenBoard((prev) => !prev)}
                >
                    {fullscreenBoard ? <PiArrowsInBold /> : <PiArrowsOutBold />}
                </button>
            </div>

            <table
                className={`team-board ${fullscreenBoard ? "fullscreen" : ""} ${editMode ? "editable" : ""}`}
            >
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Team</th>
                        <th>Pot</th>
                        <th>Price</th>
                    </tr>
                </thead>

                <tbody>
                    {localUsers.map((user) =>
                        user.selections.map((selection, index) => {
                            const isSelected = selectedSwap?.teamId === selection.teamId;
                            const isSamePot = highlightedPot === selection.pot && !isSelected;
                            const isPending = pendingTeamIds.has(selection.teamId);

                            return (
                                <tr key={`${selection.teamId}-${user.username}`}>
                                    {index === 0 && (
                                        <td className="name-cell" rowSpan={user.selections.length}>
                                            {user.username}
                                        </td>
                                    )}
                                    <td
                                        className={`
                                        team-cell 
                                        ${editMode ? "editable" : ""}
                                        ${isSelected ? "selected" : ""}
                                        ${isPending ? "pending" : ""}
                                        ${isSamePot ? "same-pot" : ""}
                                    `}
                                        onClick={() => {
                                            handleSwapSelect(selection, user.username);
                                        }}
                                    >
                                        <div className="board-team-name">
                                            <div
                                                className="flag-container"
                                                style={{
                                                    "--flag-width": "32px",
                                                }}
                                            >
                                                <img
                                                    src={`https://flagcdn.com/h120/${selection.flag}.png`}
                                                    srcSet={`https://flagcdn.com/h240/${selection.flag}.png 2x`}
                                                    alt={selection.teamName}
                                                    loading="lazy"
                                                />
                                            </div>
                                            <span>{selection.teamName}</span>
                                        </div>
                                        <button
                                            className="delete-team-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSelection(selection);
                                            }}
                                        >
                                            <PiMinusBold />
                                        </button>
                                    </td>
                                    <td>{potNames[selection.pot].price}k</td>

                                    {index === 0 && (
                                        <td className="price-cell" rowSpan={user.selections.length}>
                                            {user.totalPrice}k
                                        </td>
                                    )}
                                </tr>
                            );
                        }),
                    )}

                    <tr className="summary-row">
                        <th colSpan="3">Total Prize Pool</th>
                        <td className="summary-cell">{totalSpent}k</td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}

export default memo(BoardPrice);
