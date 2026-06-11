import { useEffect, useState } from "react";

import supabase from "../utils/supabase";

function useUsers(userName) {
    const [debouncedName, setDebouncedName] = useState("");
    const [checkingUser, setCheckingUser] = useState(false);
    const [userExists, setUserExists] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedName(userName.trim());
        }, 500);

        return () => clearTimeout(timer);
    }, [userName]);

    useEffect(() => {
        const checkUser = async () => {
            if (!debouncedName) {
                setUserExists(null);
                return;
            }

            setCheckingUser(true);

            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("username", debouncedName)
                .maybeSingle();

            if (error) {
                console.log(error);
            }

            setUserExists(data || false);

            setCheckingUser(false);
        };

        checkUser();
    }, [debouncedName]);

    const continueUser = async () => {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            alert("Please login first");

            return null;
        }

        let user = userExists;

        if (!user) {
            const { data, error } = await supabase
                .from("users")
                .insert([
                    { username: debouncedName, auth_id: authUser.id },
                ])
                .select()
                .single();

            if (error) {
                console.log(error);

                return null;
            }

            user = data;

            setUserExists(user);
        }

        setCurrentUser(user);

        return user;
    };

    const clearUser = () => {
        setCurrentUser(null);
        setUserExists(null);
        setDebouncedName("");
    };

    return {
        debouncedName,
        checkingUser,
        userExists,
        currentUser,

        continueUser,
        clearUser,
        setCurrentUser,
    };
}

export default useUsers;
