import { BRACKET_PROGRESSION } from "../features/standings/components/Bracket/bracketProgression";

export function getWinner(match) {
    if (match.home_score > match.away_score) {
        return match.home_info;
    } else if (match.home_score < match.away_score) {
        return match.away_info;
    } else {
        if (match.home_discipline > match.away_discipline) {
            return match.home_info;
        }
        return match.away_info;
    }
}

export function getLoser(match) {
    if (match.home_score > match.away_score) {
        return match.away_info;
    } else if (match.home_score < match.away_score) {
        return match.home_info;
    } else {
        if (match.home_discipline > match.away_discipline) {
            return match.away_info;
        }
        return match.home_info;
    }
}

export function getProgression(matchOrder) {
    return BRACKET_PROGRESSION[matchOrder];
}