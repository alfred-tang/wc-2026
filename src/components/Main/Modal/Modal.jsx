import { useState } from "react";

import "./Modal.css";

const Modal = ({ isOpen, onClose, children, className, rectProps = {} }) => {
    const [closing, setClosing] = useState(false);

    const handleClose = () => {
        setClosing(true);

        setTimeout(() => {
            onClose();
            setClosing(false);
        }, 700);
    };

    if (!isOpen) return null;

    return (
        <div
            className={`modal-overlay ${closing ? "closing" : ""} ${className}`}
            onClick={handleClose}
        >
            <div
                className={`modal ${closing ? "closing" : ""} ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                <svg
                    className="modal-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                >
                    <rect
                        x={rectProps.x ?? "1"}
                        y={rectProps.y ?? "1"}
                        width={rectProps.width ?? "99.6%"}
                        height={rectProps.height ?? "99.6%"}
                        rx={rectProps.rx ?? "9"}
                        ry={rectProps.ry ?? "9"}
                    />
                </svg>

                <div className={`modal-content ${closing ? "closing" : ""}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
