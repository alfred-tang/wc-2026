import { useState, useEffect } from "react";

import { BRACKET_PROGRESSION } from "../../standings/components/Bracket/bracketProgression";

import { getWinner, getLoser } from "../../../utils/knockout";
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
        const loser = getLoser(currentMatch);

        const updateData = { [progression.position]: winner.team_id };

        const { error: updateError } = await supabase
            .from("matches")
            .update(updateData)
            .eq("match_order", progression.next);

        if (updateError) {
            console.log(updateError);
            return false;
        }

        if (progression.loserTo) {
            const { error: loserUpdateError } = await supabase
                .from("matches")
                .update({
                    [progression.position]: loser.team_id,
                })
                .eq("match_order", progression.loserTo);

            if (loserUpdateError) {
                console.log(loserUpdateError);
                return false;
            }

            updateLocalMatches((match) => {
                if (match.match_order !== progression.loserTo)
                    return match;

                return {
                    ...match,
                    ...(progression.position === "home_team"
                        ? { home_info: loser }
                        : { away_info: loser }),
                };
            });
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

        const { error: eliminatedError } = await supabase
            .from("teams")
            .update({
                eliminated: true,
            })
            .eq("team_id", loser.team_id);

        if (eliminatedError) {
            console.log(eliminatedError);
            return false;
        }

        return true;
    };

    return { matches, error, loading, updateMatchScore };
};

export default useMatches;
