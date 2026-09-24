import { openDatabase, saveEvent, getAllEvents } from "./storage/eventStore.js";
import {
    createDrinkConsumedEvent,
    isValidDrinkConsumedEvent
} from "./domain/events.js";

const beer = createDrinkConsumedEvent("beer");
await saveEvent(beer);
console.log("Saved event:", beer);


const events = await getAllEvents();
console.log("All stored events:", events);

for (const event of events) {
    console.log("Event:", event);
    console.log("Is valid event:", isValidDrinkConsumedEvent(event));
}
// console.log("Created event:", beer);
// console.log("Is valid event:", isValidDrinkConsumedEvent(beer));

// const db = await openDatabase();

// console.log("Database opened:", db.name);
// console.log("Version:", db.version);
// console.log("Stores:", [...db.objectStoreNames]);