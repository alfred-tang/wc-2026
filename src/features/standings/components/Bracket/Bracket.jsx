import { useCallback, useMemo, useRef } from "react";

import BracketColumn from "../BracketColumn/BracketColumn";
import BracketCard from "../BracketCard/BracketCard";
import {
    BRACKET_COLUMNS,
    FINAL_CARD_ID,
    FINAL_STAGE,
    THIRD_PLACE_CARD_ID,
    THIRD_PLACE_STAGE,
} from "./bracketConfig";

import useBracketPaths from "../../hooks/useBracketPaths";

import "./Bracket.css";

function Bracket({ matches }) {
    const bracketRef = useRef(null);
    const matchRefs = useRef(new Map());

    const registerRef = useCallback((id, el) => {
        if (id == null) return;

        if (el) {
            matchRefs.current.set(id, el);
        } else {
            matchRefs.current.delete(id);
        }
    }, []);

    const data = useMemo(() => {
        const matchList = matches ?? [];
        const matchByOrder = new Map(
            matchList.map((match) => [match.match_order, match]),
        );

        const byOrder = (orders) =>
            orders.map((matchOrder) => matchByOrder.get(matchOrder)).filter(Boolean);

        const buildColumns = (side) =>
            BRACKET_COLUMNS[side].map(({ orders, ...column }) => ({
                ...column,
                matches: byOrder(orders),
            }));

        return {
            leftColumns: buildColumns("left"),
            rightColumns: buildColumns("right"),
            final: matchList.find((match) => match.stage === FINAL_STAGE),
            third: matchList.find((match) => match.stage === THIRD_PLACE_STAGE),
        };
    }, [matches]);

    const layoutKey = [
        ...data.leftColumns.flatMap((column) =>
            column.matches.map((match) => match.match_id),
        ),
        data.final?.match_id ?? "",
        data.third?.match_id ?? "",
        ...data.rightColumns.flatMap((column) =>
            column.matches.map((match) => match.match_id),
        ),
    ].join("|");

    const paths = useBracketPaths({
        bracketRef,
        matchRefs,
        hasFinal: Boolean(data.final),
        hasThird: Boolean(data.third),
        layoutKey,
    });

    return (
        <div ref={bracketRef} className="wc-bracket">
            <svg className="bracket-svg">
                {paths.map((path, index) => (
                    <path key={index} d={path} className="connector" />
                ))}
            </svg>
            <div className="bracket-side left">
                {data.leftColumns.map((column) => (
                    <div key={`left-${column.round}`} className="bracket-column">
                        <BracketColumn
                            title={column.title}
                            matches={column.matches}
                            round={column.round}
                            registerRef={registerRef}
                        />
                    </div>
                ))}
            </div>

            <div className="center-column">
                <div className="final-match">
                    <h3>Final</h3>
                    <BracketCard
                        cardId={FINAL_CARD_ID}
                        registerRef={registerRef}
                        match={data.final}
                        large
                    />
                </div>
                <div className="third-place">
                    <h3>Third place playoff</h3>
                    <BracketCard
                        cardId={THIRD_PLACE_CARD_ID}
                        match={data.third}
                        registerRef={registerRef}
                        large
                    />
                </div>
            </div>

            <div className="bracket-side right">
                {data.rightColumns.map((column) => (
                    <div key={`right-${column.round}`} className="bracket-column">
                        <BracketColumn
                            title={column.title}
                            matches={column.matches}
                            round={column.round}
                            registerRef={registerRef}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Bracket;
