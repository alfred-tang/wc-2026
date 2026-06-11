import { useMemo } from "react";

function useGroupedPots(pots) {
    return useMemo(() => {
        return pots.reduce((acc, pot) => {
            if (!acc[pot.pot]) {
                acc[pot.pot] = [];
            }

            acc[pot.pot].push(pot);

            return acc;
        }, {});
    }, [pots])
}

export default useGroupedPots;