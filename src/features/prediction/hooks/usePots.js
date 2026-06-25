import { useState, useEffect } from "react";
import supabase from "../../../utils/supabase";

let cachedPots = null;

const usePots = () => {
    const [pots, setPots] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (cachedPots) {
            setPots(cachedPots);
            setLoading(false);
            return;
        }

        const fetchPots = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from("teams_with_pots")
                .select("*")
                .order("world_ranking", { ascending: true });

            if (error) {
                setError("Could not fetch the pots data");
                setPots(null);
            } else {
                cachedPots = data; // Cache the pots data
                setPots(data);
                setError(null);
            }

            setLoading(false);
        };

        fetchPots();
    }, []);

    return { pots, error, loading };
}

export default usePots;
