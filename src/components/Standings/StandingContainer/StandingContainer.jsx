import StandingTable from "../StandingTable/StandingTable"

import "./StandingContainer.css"

const StandingContainer = ({ standings }) => {
    return (
        <div className="standing-container">
            {standings.map((standing) => (
                <StandingTable key={standing.standing_id} standing={standing} />
            ))}
        </div>
    )
}

export default StandingContainer