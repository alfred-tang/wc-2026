import { useMemo } from "react";

function useFilteredPots(groupedPots, query) {
    return useMemo(() => {
        if (!query) return groupedPots;

        const result = {};

        Object.entries(groupedPots).forEach(([potId, teams]) => {
            const hasMatch = teams.some((team) =>
                team.name.toLowerCase().includes(query.toLowerCase()),
            );

            if (hasMatch) {
                result[potId] = teams;
            }
        });

        return result;
    }, [groupedPots, query]);
}

export default useFilteredPots;
