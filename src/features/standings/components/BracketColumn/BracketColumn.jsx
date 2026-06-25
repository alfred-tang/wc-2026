import { memo } from "react";

import BracketCard from "../BracketCard/BracketCard";

import "./BracketColumn.css";

function BracketColumn({ title, matches, round, registerRef }) {
    return (
        <>
            <h3>{title}</h3>
            <div className={`round ${round}`}>
                {matches.map((match) => (
                    <BracketCard
                        key={match.match_id}
                        cardId={match.match_order}
                        registerRef={registerRef}
                        match={match}
                    />
                ))}
            </div>
        </>
    );
}

export default memo(BracketColumn);
