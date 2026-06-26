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
import { useIsMobile } from "../../../../hooks/useIsMobile";

import "./Bracket.css";

function Bracket({ matches }) {
    const bracketRef = useRef(null);
    const matchRefs = useRef(new Map());
    const isMobile = useIsMobile();

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

        const leftColumns = buildColumns("left");
        const rightColumns = buildColumns("right");

        const final = matchList.find((match) => match.stage === FINAL_STAGE);
        const third = matchList.find((match) => match.stage === THIRD_PLACE_STAGE);

        if (isMobile) {
            return {
                column: [
                    {
                        round: "round32",
                        title: "Round of 32",
                        matches: [...leftColumns[0].matches, ...rightColumns[3].matches],
                    },
                    {
                        round: "round16",
                        title: "Round of 16",
                        matches: [...leftColumns[1].matches, ...rightColumns[2].matches],
                    },
                    {
                        round: "quarter",
                        title: "Quarter-final",
                        matches: [...leftColumns[2].matches, ...rightColumns[1].matches],
                    },
                    {
                        round: "semi",
                        title: "Semi-final",
                        matches: [...leftColumns[3].matches, ...rightColumns[0].matches],
                    },
                ],
                final,
                third,
            };
        }

        return {
            leftColumns,
            rightColumns,
            final,
            third,
        };
    }, [matches, isMobile]);

    const layoutKey = !isMobile ? (
        [
            ...data.leftColumns.flatMap((column) =>
                column.matches.map((match) => match.match_id),
            ),
            data.final?.match_id ?? "",
            data.third?.match_id ?? "",
            ...data.rightColumns.flatMap((column) =>
                column.matches.map((match) => match.match_id),
            ),
        ].join("|")
    ) : (
        [
            ...data.column.flatMap((column) =>
                column.matches.map((match) => match.match_id),
            ),
            data.final?.match_id ?? "",
            data.third?.match_id ?? "",
        ].join("|")
    );

    const paths = useBracketPaths({
        bracketRef,
        matchRefs,
        hasFinal: Boolean(data.final),
        hasThird: Boolean(data.third),
        layoutKey,
        isMobile
    });

    const columns = isMobile ? data.column : data.leftColumns;

    return (
        <div ref={bracketRef} className="wc-bracket">
            <svg className="bracket-svg">
                {paths.map((path, index) => (
                    <path key={index} d={path} className="connector" />
                ))}
            </svg>
            <div className="bracket-side left">
                {columns.map((column, index) => (
                    <div
                        key={`${isMobile ? "mobile" : "left"}-${column.round}-${index}`}
                        className="bracket-column"
                    >
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

            {!isMobile && <div className="bracket-side right">
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
            </div>}
        </div>
    );
}

export default Bracket;
