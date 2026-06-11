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
        result.unshift('—');
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