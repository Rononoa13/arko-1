import { isValidDrinkConsumedEvent } from "./events.js";

export function countDrinks(events){
    console.log("🔥 NEW countDrinks is running");
    const drinkCounts = {};

    for (const event of events) {
        if (!isValidDrinkConsumedEvent(event)) {
            console.log("❌ Invalid event");
            continue; // Skip invalid events
        }
        // Group drinks are tracked seperately
        if (event.groupId) {
            console.log("Ignoring group event:");
            continue;
        }
        console.log("🍺 Counting personal event:", event);
        const category = event.category;
        drinkCounts[category] = (drinkCounts[category] || 0) + 1;
    }
    return drinkCounts;
}