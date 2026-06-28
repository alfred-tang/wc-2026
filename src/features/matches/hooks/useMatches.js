import { useState, useEffect } from "react";

import { BRACKET_PROGRESSION } from "../../standings/components/Bracket/bracketProgression";

import { getWinner } from "../../../utils/knockout";
import supabase from "../../../utils/supabase";

let cachedMatches = null;

const useMatches = () => {
    const [matches, setMatches] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (cachedMatches) {
            setMatches(cachedMatches);
            setLoading(false);
            return;
        }

        const fetchMatches = async () => {
            setLoading(true);

            const { data, error } = await supabase.from("matches").select(`
                match_id,
                match_order,
                stage,
                kick_off,
                home_info:teams!home_team(team_id, name, short_name, flag, stage),
                home_score,
                home_discipline,
                away_info:teams!away_team(team_id, name, short_name, flag, stage),
                away_score,
                away_discipline,
                stadiums(name, city, state_province)
            `);

            if (error) {
                setError("Could not fetch the matches data");
                setMatches(null);
                console.log(error);
            } else {
                cachedMatches = data; // Cache the matches data
                setMatches(data);
                setError(null);
            }

            setLoading(false);
        };

        fetchMatches();
    }, []);

    const updateLocalMatches = (updater) => {
        setMatches((prev) => prev.map(updater));

        cachedMatches = cachedMatches?.map(updater)
    }

    const updateMatchScore = async (
        matchId,
        homeScore,
        awayScore,
        homeDiscipline,
        awayDiscipline,
    ) => {
        const { error } = await supabase
            .from("matches")
            .update({
                home_score: homeScore,
                away_score: awayScore,
                home_discipline: homeDiscipline,
                away_discipline: awayDiscipline,
            })
            .eq("match_id", matchId);

        if (error) {
            console.log(error);
            return false;
        }

        updateLocalMatches((match) =>
            match.match_id === matchId
                ? {
                    ...match,
                    home_score: homeScore,
                    away_score: awayScore,
                    home_discipline: homeDiscipline,
                    away_discipline: awayDiscipline,
                }
                : match,
        );

        const currentMatch = {
            ...matches.find(match => match.match_id === matchId),
            home_score: homeScore,
            away_score: awayScore,
            home_discipline: homeDiscipline,
            away_discipline: awayDiscipline,
        };

        const progression =
            BRACKET_PROGRESSION[currentMatch.match_order];

        if (!progression) {
            // Final has no next match
            return true;
        }

        const winner = getWinner(currentMatch);

        const updateData = { [progression.position]: winner.team_id };

        const { updateError } = await supabase
            .from("matches")
            .update(updateData)
            .eq("match_order", progression.next);

        if (updateError) {
            console.log(updateError);
            return false;
        }

        updateLocalMatches((match) => {
            if (match.match_order !== progression.next)
                return match;

            return {
                ...match,
                ...(progression.position === "home_team"
                    ? { home_info: winner }
                    : { away_info: winner }),
            };
        })

        return true;
    };

    return { matches, error, loading, updateMatchScore };
};

export default useMatches;
