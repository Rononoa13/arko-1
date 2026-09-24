import {
    createDrinkConsumedEvent,
    isValidDrinkConsumedEvent
} from "./domain/events.js";

const beer = createDrinkConsumedEvent("beer");

console.log("Created event:", beer);
console.log("Is valid event:", isValidDrinkConsumedEvent(beer));


// const garbageEvent = {
//     id: "123",
//     type: "drink_consumed",
//     category: "banana",
//     timestamp: "yesterday"
// };

// console.log(isValidDrinkConsumedEvent(garbageEvent));