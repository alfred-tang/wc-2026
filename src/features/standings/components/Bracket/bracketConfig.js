export const FINAL_STAGE = "Final";
export const THIRD_PLACE_STAGE = "Play-off for third place";

export const FINAL_CARD_ID = "final-card";
export const THIRD_PLACE_CARD_ID = "third-place-card";

export const LEFT_SEMI_FINAL_ORDER = 101;
export const RIGHT_SEMI_FINAL_ORDER = 102;

export const BRACKET_COLUMNS = {
    left: [
        {
            title: "Round of 32",
            round: "round32",
            orders: [74, 77, 73, 75, 83, 84, 81, 82],
        },
        {
            title: "Round of 16",
            round: "round16",
            orders: [89, 90, 93, 94],
        },
        {
            title: "Quarter-final",
            round: "quarter",
            orders: [97, 98],
        },
        {
            title: "Semi-final",
            round: "semi",
            orders: [LEFT_SEMI_FINAL_ORDER],
        },
    ],
    right: [
        {
            title: "Semi-final",
            round: "semi",
            orders: [RIGHT_SEMI_FINAL_ORDER],
        },
        {
            title: "Quarter-final",
            round: "quarter",
            orders: [99, 100],
        },
        {
            title: "Round of 16",
            round: "round16",
            orders: [91, 92, 95, 96],
        },
        {
            title: "Round of 32",
            round: "round32",
            orders: [76, 78, 79, 80, 86, 88, 85, 87],
        },
    ],
};

const LEFT_CONNECTIONS = [
    [74, 89],
    [77, 89],
    [73, 90],
    [75, 90],
    [83, 93],
    [84, 93],
    [81, 94],
    [82, 94],
    [89, 97],
    [90, 97],
    [93, 98],
    [94, 98],
    [97, LEFT_SEMI_FINAL_ORDER],
    [98, LEFT_SEMI_FINAL_ORDER],
];

const RIGHT_CONNECTIONS = [
    [76, 91],
    [78, 91],
    [79, 92],
    [80, 92],
    [86, 95],
    [88, 95],
    [85, 96],
    [87, 96],
    [91, 99],
    [92, 99],
    [95, 100],
    [96, 100],
    [99, RIGHT_SEMI_FINAL_ORDER],
    [100, RIGHT_SEMI_FINAL_ORDER],
];

export const BRACKET_CONNECTIONS = [
    ...LEFT_CONNECTIONS.map(([from, to]) => ({ from, to, reverse: false })),
    ...RIGHT_CONNECTIONS.map(([from, to]) => ({ from, to, reverse: true })),
];
