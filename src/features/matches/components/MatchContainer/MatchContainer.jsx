import { useState, useMemo, useEffect, useRef } from "react";

import Modal from "../../../../components/ui/Modal/Modal";
import MatchRow from "../MatchRow/MatchRow";
import MatchEdit from "../MatchEdit/MatchEdit";
import Dropdown from "../../../../components/ui/Dropdown/Dropdown";
import Drawer from "../../../../components/ui/Drawer/Drawer";

import { PiFadersBold } from "react-icons/pi";

import { dayNames, months, stageOrder } from "../../../../utils/helpers";
import "./MatchContainer.css";

const MatchContainer = ({ matches, updateMatchScore }) => {
    const [selected, setSelected] = useState("Date");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingMatch, setEditingMatch] = useState(null);
    const [filters, setFilters] = useState({});

    const firstUnplayedSectionRef = useRef(null);

    const options = ["Date", "Stage"];

    const stageOptions = useMemo(() => {
        return [...new Set(matches.map((m) => m.stage))];
    }, [matches]);

    const teamOptions = useMemo(() => {
        const map = new Map();

        matches.forEach((m) => {
            if (m?.home_info?.name) {
                map.set(m?.home_info?.name, m?.home_info);
            }
            if (m?.away_info?.name) {
                map.set(m?.away_info?.name, m?.away_info);
            }
        });

        return Array.from(map.values());
    }, [matches]).sort((a, b) => a?.name.localeCompare(b?.name));

    const filteredMatches = useMemo(() => {
        return matches.filter((match) => {
            if (filters.stage && !filters.stage.includes(match.stage)) {
                return false;
            }

            if (filters.team) {
                const teamNames = filters.team.map(t => t.name);

                if (!teamNames.includes(match.home_info?.name) && !teamNames.includes(match.away_info?.name)) {
                    return false;
                }
            }

            return true;
        });
    }, [matches, filters]);

    const timeSorted = useMemo(() => {
        return [...filteredMatches].sort((a, b) => {
            const dateDiff = new Date(a.kick_off) - new Date(b.kick_off);
            if (dateDiff !== 0) return dateDiff;
            return a.match_order - b.match_order;
        });
    }, [filteredMatches]);

    const groupedData = useMemo(() => {
        return timeSorted.reduce((acc, match) => {
            let key;

            if (selected === "Date") {
                const dateObj = new Date(match.kick_off);

                const day = dayNames[dateObj.getDay()];
                const date = dateObj.getDate();
                const month = months[dateObj.getMonth()];
                const year = dateObj.getFullYear();

                key = `${day}, ${date} ${month} ${year}`;
            } else {
                key =
                    match.stage === "First Stage"
                        ? `Group ${match.home_info.stage}`
                        : match.stage;
            }

            if (!acc[key]) acc[key] = [];
            acc[key].push(match);

            return acc;
        }, {});
    }, [timeSorted, selected]);

    const firstUnplayedDate = useMemo(() => {
        const firstUnplayed = timeSorted.find(
            (match) =>
                match.home_score == null ||
                match.away_score == null
        );

        if (!firstUnplayed) {
            return null;
        }

        const date = new Date(firstUnplayed.kick_off);

        return `${dayNames[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]
            } ${date.getFullYear()}`;
    }, [timeSorted]);

    useEffect(() => {
        if (selected !== "Date" || !firstUnplayedDate) return;

        requestAnimationFrame(() => {
            const element = firstUnplayedSectionRef.current;
            if (!element) return;

            const headerOffset = window.innerWidth < 768 ? 120 : 125;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;

            window.scrollTo({
                top: elementPosition - headerOffset,
                behavior: "smooth",
            });
        });
    }, [selected, firstUnplayedDate]);

    return (
        <div className="match-list">
            <div className="toolbar">
                <div className="sort-container">
                    Sort by:
                    <Dropdown
                        selected={selected}
                        setSelected={setSelected}
                        options={options}
                        content={selected}
                        classNames={{
                            button: "button transparent-card",
                            menu: "dropdown-menu transparent-card",
                            item: "dropdown-item",
                        }}
                    />
                </div>
                <button
                    className="button transparent-card"
                    onClick={() => setDrawerOpen(true)}
                >
                    Filter
                    <span className="icon">
                        <PiFadersBold />
                    </span>
                </button>
                <Drawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    stageOptions={stageOptions}
                    teamOptions={teamOptions}
                    filters={filters}
                    setFilters={setFilters}
                />
            </div>
            <div className="match-container">
                {Object.entries(groupedData)
                    .sort(([a], [b]) => {
                        if (selected === "Stage") {
                            const indexA = stageOrder.indexOf(a);
                            const indexB = stageOrder.indexOf(b);

                            if (indexA === -1 && indexB === -1) {
                                return a.localeCompare(b); // fallback
                            }

                            if (indexA === -1) return 1;
                            if (indexB === -1) return -1;

                            return indexA - indexB;
                        }
                        return 0;
                    })
                    .map(([key, matches]) => {
                        const isFirstUnplayed =
                            selected === "Date" &&
                            key === firstUnplayedDate;
                        return (
                            <div
                                className="match-row-wrapper"
                                key={key}
                                ref={isFirstUnplayed ? firstUnplayedSectionRef : null}
                            >
                                <h2>{key}</h2>
                                {matches.map((match) => (
                                    <MatchRow
                                        key={match.match_id}
                                        match={match}
                                        selected={selected}
                                        onEdit={setEditingMatch}
                                    />
                                ))}
                            </div>
                        );
                    })}
            </div>
            <Modal
                isOpen={editingMatch}
                onClose={() => setEditingMatch(null)}
            >
                <MatchEdit
                    match={editingMatch}
                    onClose={() => setEditingMatch(null)}
                    onSave={updateMatchScore}
                />
            </Modal>
        </div>
    );
};

export default MatchContainer;
