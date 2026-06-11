import { useMemo } from "react";

import { potNames } from "../utils/helpers";

function useBoardPrice(teamOwners, pots) {
    const groupedUsers = useMemo(() => {
        const grouped = {};

        Object.entries(teamOwners).forEach(([teamId, info]) => {
            const team = pots.find((t) => t.team_id === Number(teamId));

            if (!team) return;

            const username = info.username;
            const price = potNames[info.pot].price;

            if (!grouped[username]) {
                grouped[username] = {
                    username,
                    totalPrice: 0,
                    selections: [],
                };
            }

            grouped[username].selections.push({
                teamId: Number(teamId),
                userId: info.user_id,
                teamName: team.name,
                flag: team.flag,
                pot: info.pot,
                price,
            });

            grouped[username].totalPrice += price;
        });

        return Object.values(grouped)
            .map((user) => ({
                ...user,

                selections: user.selections.sort((a, b) => b.price - a.price),
            }))
            .sort((a, b) => b.totalPrice - a.totalPrice);
    }, [teamOwners, pots]);

    const totalSpent = groupedUsers.reduce(
        (sum, user) => sum + user.totalPrice,
        0,
    );

    return { groupedUsers, totalSpent };
}

export default useBoardPrice;
