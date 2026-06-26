import { useLayoutEffect, useState } from "react";

import {
    BRACKET_CONNECTIONS,
    FINAL_CARD_ID,
    LEFT_SEMI_FINAL_ORDER,
    RIGHT_SEMI_FINAL_ORDER,
    THIRD_PLACE_CARD_ID,
} from "../components/Bracket/bracketConfig";

const arePathsEqual = (currentPaths, nextPaths) =>
    currentPaths.length === nextPaths.length &&
    currentPaths.every((path, index) => path === nextPaths[index]);

const coord = (value) => Math.round(value * 100) / 100;

function createPath(container, fromEl, toEl, reverse = false) {
    const from = fromEl.getBoundingClientRect();
    const to = toEl.getBoundingClientRect();

    const y1 = from.top - container.top + from.height / 2;
    const y2 = to.top - container.top + to.height / 2;
    const x1 = reverse ? from.left - container.left : from.right - container.left;
    const x2 = reverse ? to.right - container.left : to.left - container.left;
    const mid = (x1 + x2) / 2;

    return `
        M ${coord(x1)} ${coord(y1)}
        H ${coord(mid)}
        V ${coord(y2)}
        H ${coord(x2)}
    `;
}

function useBracketPaths({
    bracketRef,
    matchRefs,
    hasFinal,
    hasThird,
    layoutKey,
    isMobile
}) {
    const [paths, setPaths] = useState([]);

    useLayoutEffect(() => {
        const bracketEl = bracketRef.current;

        if (!bracketEl) return undefined;

        let frameId;

        const buildPaths = () => {
            const container = bracketEl.getBoundingClientRect();
            const nextPaths = [];

            const connect = (fromId, toId, reverse = false) => {
                const fromEl = matchRefs.current.get(fromId);
                const toEl = matchRefs.current.get(toId);

                if (!fromEl || !toEl) return;

                nextPaths.push(createPath(container, fromEl, toEl, reverse));
            };

            BRACKET_CONNECTIONS.forEach(({ from, to, reverse }) => {
                connect(from, to, isMobile ? !isMobile : reverse);
            });

            if (hasFinal) {
                connect(LEFT_SEMI_FINAL_ORDER, FINAL_CARD_ID);
                connect(RIGHT_SEMI_FINAL_ORDER, FINAL_CARD_ID, !isMobile);
            }

            if (hasThird) {
                connect(LEFT_SEMI_FINAL_ORDER, THIRD_PLACE_CARD_ID);
                connect(RIGHT_SEMI_FINAL_ORDER, THIRD_PLACE_CARD_ID, !isMobile);
            }

            setPaths((currentPaths) =>
                arePathsEqual(currentPaths, nextPaths) ? currentPaths : nextPaths,
            );
        };

        const scheduleBuild = () => {
            cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(buildPaths);
        };

        scheduleBuild();

        const resizeObserver =
            typeof ResizeObserver === "function"
                ? new ResizeObserver(scheduleBuild)
                : null;

        resizeObserver?.observe(bracketEl);
        matchRefs.current.forEach((el) => resizeObserver?.observe(el));
        window.addEventListener("resize", scheduleBuild);

        return () => {
            cancelAnimationFrame(frameId);
            resizeObserver?.disconnect();
            window.removeEventListener("resize", scheduleBuild);
        };
    }, [bracketRef, hasFinal, hasThird, layoutKey, matchRefs]);

    return paths;
}

export default useBracketPaths;
