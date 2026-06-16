export const potNames = {
    1: { name: "Champions", price: 50 },
    2: { name: "Contenders", price: 40 },
    3: { name: "Challengers", price: 30 },
    4: { name: "Dark Horses", price: 20 },
    5: { name: "Hopefuls", price: 16 },
    6: { name: "Underdogs", price: 12 },
    7: { name: "Rising Teams", price: 10 },
    8: { name: "Fighters", price: 8 },
    9: { name: "Wildcards", price: 6 },
    10: { name: "Dreamers", price: 4 },
    11: { name: "Survivors", price: 2 },
    12: { name: "Long Shots", price: 1 },
};

export const stageOrder = [
    "Group A",
    "Group B",
    "Group C",
    "Group D",
    "Group E",
    "Group F",
    "Group G",
    "Group H",
    "Group I",
    "Group J",
    "Group K",
    "Group L",
    "Round of 32",
    "Round of 16",
    "Quarter-final",
    "Semi-final",
    "Play-off for third place",
    "Final",
];

export const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

export const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const sortArray = (arr, column, reverse = false) => {
    const sortedArray = [...arr].sort((a, b) => {
        if (a[column] < b[column]) return -1;
        if (a[column] > b[column]) return 1;
        return 0;
    });

    if (reverse) {
        return sortedArray.reverse();
    }

    return sortedArray;
}

export const lastFive = (arr) => {
    const result = arr.slice(-5);

    while (result.length < 5) {
        result.push('—');
    }

    return result;
}

export const toGeoJson = (rows) => {
    return {
        type: "FeatureCollection",
        features: rows.map(row => ({
            type: "Feature",
            properties: {
                name: row.name,
                city: row.city,
                state_province: row.state_province,
                country: row.teams.name,
                code: row.teams.flag,
                capacity: row.capacity
            },
            geometry: {
                type: "Point",
                coordinates: [row.lng, row.lat]
            }
        }))
    }
}

export function calculateStandings(teams, matches) {
    const standings = {};

    teams.forEach((team) => {
        standings[team.team_id] = {
            ...team,

            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,

            goals_for: 0,
            goals_against: 0,

            points: 0,
            discipline: 0,

            form: [],
        };
    });

    matches.forEach((match) => {
        if (
            match.home_score === null ||
            match.away_score === null
        ) {
            return;
        }

        const home = standings[match.home_info.team_id];
        const away = standings[match.away_info.team_id];

        if (!home || !away) return;

        home.discipline += match.home_discipline ?? 0;
        away.discipline += match.away_discipline ?? 0;

        home.played++;
        away.played++;

        home.goals_for += match.home_score;
        home.goals_against += match.away_score;

        away.goals_for += match.away_score;
        away.goals_against += match.home_score;

        if (match.home_score > match.away_score) {
            home.wins++;
            home.points += 3;
            home.form.push("W");

            away.losses++;
            away.form.push("L");
        }
        else if (match.home_score < match.away_score) {
            away.wins++;
            away.points += 3;
            away.form.push("W");

            home.losses++;
            home.form.push("L");
        }
        else {
            home.draws++;
            away.draws++;

            home.points++;
            away.points++;

            home.form.push("D");
            away.form.push("D");
        }
    });

    return Object.values(standings)
        .map((team) => ({
            ...team,

            goal_difference:
                team.goals_for - team.goals_against,

            form: team.form.slice(-5),
        }))
        .sort((a, b) => {
            if (b.points !== a.points)
                return b.points - a.points;

            const gdA =
                a.goals_for - a.goals_against;

            const gdB =
                b.goals_for - b.goals_against;

            if (gdB !== gdA)
                return gdB - gdA;

            if (b.goals_for !== a.goals_for)
                return b.goals_for - a.goals_for;

            // Fair Play (lower discipline is better)
            if (a.discipline !== b.discipline) {
                return a.discipline - b.discipline;
            }

            return a.pool - b.pool;
        });
}