const DRINK_CATEGORIES = [
    "beer",
    "other",
    "water"
];

export function createDrinkConsumedEvent(category, timestamp = new Date()) {
    if (!DRINK_CATEGORIES.includes(category)) {
        throw new Error(`Invalid drink category: ${category}`);
    }

    return {
        id: crypto.randomUUID(),
        type: "drink_consumed",
        category,
        timestamp: timestamp.toISOString()
    };
}

const beer = createDrinkConsumedEvent("beer");
console.log(beer);