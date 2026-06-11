import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

let cachedTeams = null;

const useTeams = () => {
    const [teams, setTeams] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (cachedTeams) {
            setTeams(cachedTeams);
            setLoading(false);
            return;
        }
        
        const fetchTeams = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from("teams")
                .select();

            if (error) {
                setError("Could not fetch the teams data");
                setTeams(null);
            } else {
                cachedTeams = data; // Cache the teams data
                setTeams(data);
                setError(null);
            }

            setLoading(false);
        };

        fetchTeams();
    }, []);

    return { teams, error, loading };
};

export default useTeams;