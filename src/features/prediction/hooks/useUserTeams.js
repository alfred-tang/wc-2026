import { useEffect, useMemo, useState } from "react";

import supabase from "../../../utils/supabase";

function useUserTeams(currentUser) {
    const [teamOwners, setTeamOwners] = useState({});
    const [userTakenPots, setUserTakenPots] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSelections();
    }, [currentUser]);

    const fetchSelections = async () => {
        setLoading(true);

        const { data, error } = await supabase.from("user_teams").select(`
                team_id,
                user_id,
                pot,
                users(username)
            `);

        if (error) {
            console.log(error);
            setLoading(false);
            return;
        }

        const owners = {};
        const takenPots = [];

        data.forEach((entry) => {
            owners[entry.team_id] = {
                username: entry.users?.username,
                pot: entry.pot,
                user_id: entry.user_id,
            };

            if (currentUser && entry.user_id === currentUser.user_id) {
                takenPots.push(entry.pot);
            }
        });

        setTeamOwners(owners);
        setUserTakenPots(takenPots);

        setLoading(false);
    };

    const takenTeams = useMemo(
        () => Object.keys(teamOwners).map(Number),
        [teamOwners],
    );

    const assignTeam = async (currentUser, team, potId) => {
        const { error } = await supabase.from("user_teams").insert([
            {
                user_id: currentUser.user_id,

                team_id: team.team_id,

                pot: Number(potId),
            },
        ]);

        if (error) {
            console.log(error);
            return false;
        }

        setUserTakenPots((prev) => [...prev, Number(potId)]);

        setTeamOwners((prev) => ({
            ...prev,

            [team.team_id]: {
                username: currentUser.username,

                pot: Number(potId),
            },
        }));

        return true;
    };

    const swapTeams = async (teamA, teamB) => {
        const { error } = await supabase.rpc("swap_teams", {
            team_a_id: teamA.teamId,
            team_b_id: teamB.teamId,
        });

        if (error) {
            console.log(error);
            return false;
        }

        await fetchSelections();

        return true;
    };

    const deleteSelection = async (teamId) => {
        const { error } = await supabase
            .from("user_teams")
            .delete()
            .eq("team_id", teamId);

        if (error) {
            console.error(error);
            return false;
        }

        await fetchSelections();

        return true;
    };

    return {
        loading,
        teamOwners,
        userTakenPots,
        takenTeams,
        fetchSelections,
        assignTeam,
        swapTeams,
        deleteSelection
    };
}

export default useUserTeams;
