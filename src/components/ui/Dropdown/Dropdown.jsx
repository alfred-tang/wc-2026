import { useState, useRef, useEffect } from "react";

import { PiCaretUpBold, PiCheckBold } from "react-icons/pi";

import "./Dropdown.css";

const placeholderFlag = "/assets/team/shield-logo.png";

const Dropdown = ({
    selected,
    setSelected,
    options,
    content,
    classNames = {},
    closeOnOutsideClick = true,
    closeOnSelect = true,
    multiSelect = false,
    resetSignal = false, // optional signal to reset selection when it changes
}) => {
    const [open, setOpen] = useState(false);
    const computedOptions = multiSelect ? ["All", ...options] : options;
    const dropdownRef = useRef(null);

    // Reset selection when resetSignal changes
    useEffect(() => {
        if (!resetSignal) {
            setOpen(false);
        }
    }, [resetSignal]);
    // close when clicking outside
    useEffect(() => {
        if (!open || !closeOnOutsideClick) return;
        const handleClickOutside = (e) => {
            if (!dropdownRef.current?.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, closeOnOutsideClick]);

    const handleSelect = (option) => {
        if (multiSelect) {
            if (option === "All") {
                setSelected(["All"]);
                return;
            }

            let newSelected = selected.filter(item => item !== "All");

            const exists = newSelected.includes(option);

            newSelected = exists
                ? newSelected.filter((item) => item !== option)
                : [...newSelected, option];

            if (newSelected.length === 0) {
                newSelected = ["All"];
            } else if (newSelected.length === options.length) {
                newSelected = ["All"];
            }

            setSelected(newSelected);
        } else {
            setSelected(option);
            if (closeOnSelect) setOpen(false);
        }

        if (closeOnSelect && !multiSelect) {
            setOpen(false);
        }
    };

    return (
        <div
            style={{ width: multiSelect ? "100%" : "auto" }}
            className="dropdown"
            ref={dropdownRef}
        >
            <button
                className={classNames.button || ""}
                onClick={() => setOpen((prev) => !prev)}
            >
                {content}
                <span className={`icon arrow ${open ? "open" : ""}`}>
                    <PiCaretUpBold />
                </span>
            </button>

            {open && (
                <div className={classNames.menu || ""}>
                    {computedOptions.map((option, index) => {
                        const isActive = multiSelect
                            ? selected.includes(option)
                            : selected === option;

                        return (
                            <div
                                key={option?.team_id ?? option?.id ?? option?.name ?? `${option}-${index}`}
                                className={`${classNames.item || ""} ${isActive ? "active" : ""}`}
                                onClick={() => handleSelect(option)}
                            >
                                <div className="option-content">
                                    {content === "Team" && option?.flag && (
                                        <div
                                            className="flag-container"
                                            style={{ "--flag-width": "24px", marginRight: "8px" }}
                                        >
                                            <img
                                                className={`option-flag ${isActive ? "active" : ""}`}
                                                src={
                                                    option?.flag
                                                        ? `https://flagcdn.com/h120/${option.flag}.png`
                                                        : placeholderFlag
                                                }
                                                srcSet={
                                                    option?.flag
                                                        ? `https://flagcdn.com/h240/${option.flag}.png 2x`
                                                        : undefined
                                                }
                                                alt={option?.name}
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                    {option?.name ? option?.name : option}
                                </div>
                                {isActive && multiSelect && <PiCheckBold />}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
