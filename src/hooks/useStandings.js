import { useState, useEffect } from "react";
import supabase from "../utils/supabase";

let cachedStandings = null;

const useStandings = () => {
    const [standings, setStandings] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (cachedStandings) {
            setStandings(cachedStandings);
            setLoading(false);
            return;
        }

        const fetchStandings = async () => {
            setLoading(true);

            const { data, error } = await supabase.from("standings").select(`
                    *,
                    standing_teams (
                        *,
                        teams(name, flag)
                    )
                `);

            if (error) {
                setError("Could not fetch the standings data");
                setStandings(null);
            } else {
                cachedStandings = data; // Cache the standings data
                setStandings(data);
                setError(null);
            }

            setLoading(false);
        };

        fetchStandings();
    }, []);

    return { standings, error, loading };
};

export default useStandings;