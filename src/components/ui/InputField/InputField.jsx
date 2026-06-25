import { PiXCircle } from "react-icons/pi";

import "./InputField.css"

function InputField({ value, onChange, placeholder, className, onClear }) {
    return (
        <>
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                className={className}
                onChange={(e) => onChange(e.target.value)}
            />

            {value && (
                <button type="button" className="clear-input-btn" onClick={onClear}>
                    <PiXCircle />
                </button>
            )}
        </>
    );
}

export default InputField;