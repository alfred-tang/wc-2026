import Loading from "../../components/layout/Loading/Loading";
import TeamTable from "./components/TeamTable/TeamTable";

import useTeams from "./hooks/useTeams";

import "./Teams.css";

function Teams() {
    const { teams, error, loading } = useTeams();

    if (loading) return <Loading />;
    if (error) return <p>{error}</p>;

    return (
        <div className="table-wrapper transparent-card">
            <TeamTable teams={teams} />
        </div>
    );
}

export default Teams;
