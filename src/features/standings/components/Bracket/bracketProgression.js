export const BRACKET_PROGRESSION = {
    74: {
        next: 89,
        position: 'home_team',
    },
    77: {
        next: 89,
        position: 'away_team',
    },
    73: {
        next: 90,
        position: 'home_team',
    },
    75: {
        next: 90,
        position: 'away_team',
    },
    83: {
        next: 93,
        position: 'home_team',
    },
    84: {
        next: 93,
        position: 'away_team',
    },
    81: {
        next: 94,
        position: 'home_team',
    },
    82: {
        next: 94,
        position: 'away_team',
    },
    76: {
        next: 91,
        position: 'home_team',
    },
    78: {
        next: 91,
        position: 'away_team'
    },
    79: {
        next: 92,
        position: 'home_team',
    },
    80: {
        next: 92,
        position: 'away_team',
    },
    86: {
        next: 95,
        position: 'home_team',
    },
    88: {
        next: 95,
        position: 'away_team',
    },
    85: {
        next: 96,
        position: 'home_team'
    },
    87: {
        next: 96,
        position: 'away_team',
    },
    89: {
        next: 97,
        position: 'home_team',
    },
    90: {
        next: 97,
        position: 'away_team',
    },
    93: {
        next: 98,
        position: 'home_team',
    },
    94: {
        next: 98,
        position: 'away_team',
    },
    91: {
        next: 99,
        position: 'home_team',
    },
    92: {
        next: 99,
        position: 'away_team',
    },
    95: {
        next: 100,
        position: 'home_team',
    },
    96: {
        next: 100,
        position: 'away_team',
    },
    97: {
        next: 101,
        position: 'home_team',
    },
    98: {
        next: 101,
        position: 'away_team',
    },
    99: {
        next: 102,
        position: 'home_team',
    },
    100: {
        next: 102,
        position: 'away_team',
    },
    101: {
        next: 104,
        loserTo: 103,
        position: 'home_team',
    },
    102: {
        next: 104,
        loserTo: 103,
        position: 'away_team'
    }
}

export function getPlaceholder(matchOrder, position) {
    const source = Object.entries(BRACKET_PROGRESSION).find(
        ([from, progression]) =>
            progression.next === matchOrder &&
            progression.position === position
    );

    if (!source) return "TBD";

    return `W${source[0]}`;
}

export function getRunnerUpPlaceholder(matchOrder, position) {
    const source = Object.entries(BRACKET_PROGRESSION).find(
        ([from, progression]) =>
            progression.loserTo === matchOrder &&
            progression.position === position
    );

    if (!source) return "TBD";

    return `RU${source[0]}`;
}