import { useState, useEffect, cache } from "react";
import supabase from "../utils/supabase";

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
                home_score,
                away_score,
                home_info:teams!home_team(name, flag, stage),
                away_info:teams!away_team(name, flag, stage),
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

    const updateMatchScore = async (matchId, homeScore, awayScore) => {
        const { error } = await supabase
            .from("matches")
            .update({ home_score: homeScore, away_score: awayScore })
            .eq("match_id", matchId);

        if (error) {
            console.log(error);
            return false;
        }

        setMatches((prev) =>
            prev.map((match) =>
                match.match_id === matchId
                    ? {
                        ...match,
                        home_score: homeScore,
                        away_score: awayScore,
                    }
                    : match,
            ),
        );

        cachedMatches = cachedMatches?.map((match) =>
            match.match_id === matchId
                ? {
                    ...match,
                    home_score: homeScore,
                    away_score: awayScore,
                }
                : match,
        );

        return true;
    };

    return { matches, error, loading, updateMatchScore };
};

export default useMatches;
