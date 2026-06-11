import './TeamCard.css'

const TeamCard = ({ team }) => {
    return (
        <tr
            key={team.team_id}
            className={`team-card team-${team.flag}`}
            style={{
                '--background-image': `url(/assets/team/${team.flag}-logo.svg)`,
                '--color-hover': `var(--team-${team.flag})`,
            }}
        >
            <td>{team.world_ranking}</td>
            <td className='team-col align-left'>
                {team.name}
                <div className="flag-container">
                    <img
                        src={`https://flagcdn.com/h120/${team.flag}.png`}
                        srcSet={`https://flagcdn.com/h240/${team.flag}.png 2x`}
                        alt={team.name}
                        loading='lazy'
                    />
                </div>
            </td>
            <td>{team.stage}</td>
            <td className='align-left'>{team.region}</td>
            <td>{team.participations}</td>
        </tr>
    )
}

export default TeamCard