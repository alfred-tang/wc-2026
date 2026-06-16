import StandingTable from "../StandingTable/StandingTable"

import "./StandingContainer.css"

const StandingContainer = ({ standings, matches }) => {
    return (
        <div className="standing-container">
            {standings.map((standing) => (
                <StandingTable key={standing.standing_id} standing={standing} matches={matches} />
            ))}
        </div>
    )
}

export default StandingContainer