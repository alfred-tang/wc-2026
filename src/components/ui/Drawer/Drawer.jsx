import { useEffect, useState } from "react";

import { PiXBold } from "react-icons/pi";

import Dropdown from "../Dropdown/Dropdown";

import "./Drawer.css";

const Drawer = ({ open, onClose, stageOptions, teamOptions, filters, setFilters }) => {
    const [stageSelected, setStageSelected] = useState(["All"]);
    const [teamSelected, setTeamSelected] = useState(["All"]);

    const handleApply = () => {
        setFilters({
            stage: stageSelected.includes("All") ? null : stageSelected,
            team: teamSelected.includes("All") ? null : teamSelected,
        })
        onClose();
    }

    const handleClear = () => {
        setStageSelected(["All"]);
        setTeamSelected(["All"]);
        setFilters({});
        onClose();
    }

    useEffect(() => {
        if (open) {
            setStageSelected(filters.stage || ["All"]);
            setTeamSelected(filters.team || ["All"]);
        }
    }, [open]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, []);

    return (
        <>
            <div
                className={`drawer-overlay ${open ? "show" : ""}`}
                onClick={onClose}
            />

            <div className={`drawer ${open ? "open" : ""}`}>
                <div className="drawer-header">
                    <h2>Filters</h2>
                    <button className="drawer-exit" onClick={onClose}>
                        <PiXBold />
                    </button>
                </div>
                <div className="drawer-content">
                    {/* Stage filter */}

                    <div className="filter-group">
                        <Dropdown
                            selected={stageSelected}
                            setSelected={setStageSelected}
                            options={stageOptions}
                            content="Stage"
                            classNames={{
                                button: "filter-title",
                                item: "filter-item",
                            }}
                            closeOnOutsideClick={false}
                            closeOnSelect={false}
                            multiSelect={true}
                            resetSignal={open} // reset when stage filter is applied
                        />
                    </div>

                    {/* Team filter (example) */}

                    <div className="filter-group">
                        <Dropdown
                            selected={teamSelected}
                            setSelected={setTeamSelected}
                            options={teamOptions}
                            content="Team"
                            classNames={{
                                button: "filter-title",
                                item: "filter-item",
                            }}
                            closeOnOutsideClick={false}
                            closeOnSelect={false}
                            multiSelect={true}
                            resetSignal={open} // reset when team filter is applied
                        />
                    </div>
                </div>

                <div className="drawer-footer">
                    <button onClick={handleClear}>CLEAR</button>
                    <button className="apply-button" onClick={handleApply}>APPLY</button>
                </div>
            </div>
        </>
    );
};

export default Drawer;
