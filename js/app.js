import { openDatabase, saveEvent } from "./storage/eventStore.js";
import {
    createDrinkConsumedEvent,
    isValidDrinkConsumedEvent
} from "./domain/events.js";

const beer = createDrinkConsumedEvent("beer");
await saveEvent(beer);
console.log("Saved event:", beer);
// console.log("Created event:", beer);
// console.log("Is valid event:", isValidDrinkConsumedEvent(beer));

// const db = await openDatabase();

// console.log("Database opened:", db.name);
// console.log("Version:", db.version);
// console.log("Stores:", [...db.objectStoreNames]);