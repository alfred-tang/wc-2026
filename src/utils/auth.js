import supabase from "./supabase";

export const ensureAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        return session.user;
    }

    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
        console.error("Error signing in anonymously:", error);
        return null;
    }

    return data.user;
};