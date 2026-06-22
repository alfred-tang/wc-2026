import { useMemo, useRef, useLayoutEffect, useState } from "react";

import "./Bracket.css";

function Bracket({ matches }) {
    const bracketRef = useRef(null);
    const matchRefs = useRef({});
    const [paths, setPaths] = useState([]);

    const registerRef = (id, el) => {
        if (el) {
            matchRefs.current[id] = el;
        }
    };

    const data = useMemo(() => {
        const stage = (name) =>
            matches
                .filter((m) => m.stage === name)
                .sort((a, b) => a.match_order - b.match_order);

        const round32 = stage("Round of 32");
        const round16 = stage("Round of 16");
        const quarter = stage("Quarter-final");
        const semi = stage("Semi-final");

        return {
            left: {
                round32: round32.slice(0, 8),
                round16: round16.slice(0, 4),
                quarter: quarter.slice(0, 2),
                semi: semi.slice(0, 1),
            },

            right: {
                round32: round32.slice(8),
                round16: round16.slice(4),
                quarter: quarter.slice(2),
                semi: semi.slice(1),
            },

            final: stage("Final")[0],
            third: stage("Play-off for third place")[0],
        };
    }, [matches]);

    useLayoutEffect(() => {
        if (!bracketRef.current) return;

        const container =
            bracketRef.current.getBoundingClientRect();

        const nextPaths = [];

        const connect = (
            fromId,
            toId,
            reverse = false
        ) => {
            const fromEl =
                matchRefs.current[fromId];

            const toEl =
                matchRefs.current[toId];

            if (!fromEl || !toEl) return;

            const from =
                fromEl.getBoundingClientRect();

            const to =
                toEl.getBoundingClientRect();

            const y1 =
                from.top -
                container.top +
                from.height / 2;

            const y2 =
                to.top -
                container.top +
                to.height / 2;

            if (!reverse) {
                const x1 =
                    from.right -
                    container.left;

                const x2 =
                    to.left -
                    container.left;

                const mid =
                    x1 + (x2 - x1) / 2;

                nextPaths.push(`
                M ${x1} ${y1}
                H ${mid}
                V ${y2}
                H ${x2}
            `);
            } else {
                const x1 =
                    from.left -
                    container.left;

                const x2 =
                    to.right -
                    container.left;

                const mid =
                    x1 - (x1 - x2) / 2;

                nextPaths.push(`
                M ${x1} ${y1}
                H ${mid}
                V ${y2}
                H ${x2}
            `);
            }
        };

        // LEFT
        data.left.round32.forEach((m, i) => {
            const target =
                data.left.round16[
                Math.floor(i / 2)
                ];

            if (target)
                connect(
                    m.match_id,
                    target.match_id
                );
        });

        data.left.round16.forEach((m, i) => {
            const target =
                data.left.quarter[
                Math.floor(i / 2)
                ];

            if (target)
                connect(
                    m.match_id,
                    target.match_id
                );
        });

        data.left.quarter.forEach((m) =>
            connect(
                m.match_id,
                data.left.semi[0].match_id
            )
        );

        // RIGHT
        data.right.round32.forEach((m, i) => {
            const target =
                data.right.round16[
                Math.floor(i / 2)
                ];

            if (target)
                connect(
                    m.match_id,
                    target.match_id,
                    true
                );
        });

        data.right.round16.forEach((m, i) => {
            const target =
                data.right.quarter[
                Math.floor(i / 2)
                ];

            if (target)
                connect(
                    m.match_id,
                    target.match_id,
                    true
                );
        });

        data.right.quarter.forEach((m) =>
            connect(
                m.match_id,
                data.right.semi[0].match_id,
                true
            )
        );

        // FINAL
        if (data.final) {
            connect(
                data.left.semi[0].match_id,
                data.final.match_id
            );

            connect(
                data.right.semi[0].match_id,
                data.final.match_id,
                true
            );
        }

        setPaths(nextPaths);
    }, [data]);

    return (
        <div className="wc-bracket" ref={bracketRef}>
            <svg className="bracket-svg">
                {paths.map((path, index) => (
                    <path key={index} d={path} className="connector" />
                ))}
            </svg>
            <div className="bracket-side left">
                <div className="bracket-column">
                    <BracketColumn
                        title="Round of 32"
                        matches={data.left.round32}
                        registerRef={registerRef}
                        round="round32"
                    />
                </div>

                <div className="bracket-column">
                    <BracketColumn
                        title="Round of 16"
                        matches={data.left.round16}
                        registerRef={registerRef}
                        round="round16"
                    />
                </div>

                <div className="bracket-column">
                    <BracketColumn
                        title="Quarter-final"
                        matches={data.left.quarter}
                        registerRef={registerRef}
                        round="quarter"
                    />
                </div>

                <div className="bracket-column">
                    <BracketColumn
                        title="Semi-final"
                        matches={data.left.semi}
                        registerRef={registerRef}
                        round="semi"
                    />
                </div>
            </div>

            <div className="center-column">
                <h3>Final</h3>

                <MatchCard
                    cardId="final"
                    match={data.final}
                    registerRef={registerRef}
                    large
                />

                <h3>Third Place</h3>

                <MatchCard match={data.third} registerRef={registerRef} />
            </div>

            <div className="bracket-side right">
                <div className="bracket-column">
                    <BracketColumn
                        title="Semi-final"
                        matches={data.right.semi}
                        registerRef={registerRef}
                        round="semi"
                    />
                </div>

                <div className="bracket-column">
                    <BracketColumn
                        title="Quarter-final"
                        matches={data.right.quarter}
                        registerRef={registerRef}
                        round="quarter"
                    />
                </div>

                <div className="bracket-column">
                    <BracketColumn
                        title="Round of 16"
                        matches={data.right.round16}
                        registerRef={registerRef}
                        round="round16"
                    />
                </div>

                <div className="bracket-column">
                    <BracketColumn
                        title="Round of 32"
                        matches={data.right.round32}
                        registerRef={registerRef}
                        round="round32"
                    />
                </div>
            </div>
        </div>
    );
}

function BracketColumn({ title, matches, registerRef, round }) {
    return (
        <>
            <h3>{title}</h3>

            <div className={`round ${round}`}>
                {matches.map((match) => (
                    <MatchCard
                        key={match.match_id}
                        match={match}
                        registerRef={registerRef}
                    />
                ))}
            </div>
        </>
    );
}

function MatchCard({ match, cardId, registerRef, large = false }) {
    if (!match) return null;

    return (
        <div
            ref={(el) => registerRef(cardId, el)}
            data-match={match.match_id}
            className={`match-card ${large ? "large" : ""}`}
        >
            <div className="team">
                <span>
                    {match.home_info?.short_name || match.home_info?.name || "TBD"}
                </span>

                <span>{match.home_score ?? ""}</span>
            </div>

            <div className="team">
                <span>
                    {match.away_info?.short_name || match.away_info?.name || "TBD"}
                </span>

                <span>{match.away_score ?? ""}</span>
            </div>
        </div>
    );
}

export default Bracket;
