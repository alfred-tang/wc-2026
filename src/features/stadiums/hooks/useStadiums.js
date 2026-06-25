import { useState, useEffect } from "react";
import supabase from "../../../utils/supabase";

let cachedStadiums = null;

const useStadiums = () => {
    const [stadiums, setStadiums] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (cachedStadiums) {
            setStadiums(cachedStadiums);
            setLoading(false);
            return;
        }

        const fetchStadiums = async () => {
            setLoading(true);

            const { data, error } = await supabase.from("stadiums").select(`
                    *,
                    teams(name, flag)
                `);

            if (error) {
                setError("Could not fetch the stadiums data");
                setStadiums(null);
            } else {
                cachedStadiums = data; // Cache the stadiums data
                setStadiums(data);
                setError(null);
            }

            setLoading(false);
        };

        fetchStadiums();
    }, []);

    return { stadiums, error, loading };
};

export default useStadiums;
