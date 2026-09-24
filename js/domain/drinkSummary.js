import { isValidDrinkConsumedEvent } from "./events.js";

export function countDrinks(events){
    const drinkCounts = {};

    for (const event of events) {
        if (!isValidDrinkConsumedEvent(event)) {
            continue; // Skip invalid events
        }
        const category = event.category;
        drinkCounts[category] = (drinkCounts[category] || 0) + 1;
    }
    return drinkCounts;
}