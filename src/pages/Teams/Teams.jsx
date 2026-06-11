import TeamTable from "../../components/Teams/TeamTable/TeamTable";
import useTeams from "../../hooks/useTeams";

import "./Teams.css";

function Teams() {
    const { teams, error, loading } = useTeams();

    if (loading) return <p>Loading teams...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="table-wrapper transparent-card">
            <TeamTable teams={teams} />
        </div>
    );
}

export default Teams;
