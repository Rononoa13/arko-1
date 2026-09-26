import { saveEvent, getAllEvents, clearEvents, getExistingGroup, saveGroup, clearGroups } from "./storage/eventStore.js";
import { createDrinkConsumedEvent, createGroup, addMemberToGroup, startGroup } from "./domain/events.js";
import { countDrinks } from "./domain/drinkSummary.js";
import { renderDrinkCounts } from "./ui/appView.js";


async function render() {
    const events = await getAllEvents();
    const drinkCounts = countDrinks(events);
    renderDrinkCounts(drinkCounts);
}

const addBeerButton = document.getElementById("add-beer");
addBeerButton.addEventListener("click", async () => {
    const beerEvent = createDrinkConsumedEvent("beer");
    await saveEvent(beerEvent);
    await render();
    
    addBeerButton.classList.remove("tap");
    // Force animation restart
    void addBeerButton.offsetWidth;
    addBeerButton.classList.add("tap");
});

// Delete events inside the event object store from IndexedDB
const resetEventsButton = document.getElementById("reset-session");
resetEventsButton.addEventListener("click", async () => {
    const confirmReset = confirm("Are you sure you want to reset the session? This will delete recorded drinks.");
    if (!confirmReset) {
        return;
    }
    await clearEvents();
    await render();
});

await render(); // Initial render on page load

// iOS PWA install prompt
const iosInstallPrompt = document.querySelector("#install-ios");
const dismissIosInstall = document.querySelector("#dismiss-ios-install");

if (iosInstallPrompt && dismissIosInstall) {
    const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;

    const hasDismissedInstall =
        localStorage.getItem("ios-install-dismissed") === "true";

    if (isIOS && !isStandalone && !hasDismissedInstall) {
        iosInstallPrompt.hidden = false;
    }

    dismissIosInstall.addEventListener("click", () => {
        iosInstallPrompt.hidden = true;
        localStorage.setItem("ios-install-dismissed", "true");
    });

}

// Application flow when creating a group !
const startGroupButton = document.getElementById("create-a-group");
startGroupButton.addEventListener("click", async () => {
    // await clearGroups();
    const existingGroup = await getExistingGroup();
    if (existingGroup) {
        // console.log("existingGroup: ", existingGroup)
        startGroup(existingGroup)
        return;
    }
    console.log("No group exists. Create one.");
    const groupForm = document.getElementById("group-form");
    groupForm.hidden = false;

    const createGroupForm = document.getElementById("create-group-form")
    createGroupForm.addEventListener("submit", async (event) => {
        console.log("SUBMIT HANDLER FIRED");
        event.preventDefault()
        // Get values from 2 inputs:
        // Create a FormData instance from the form element and value from "name" attribute
        const formData = new FormData(event.target);
        const groupName = formData.get("groupName")
        const memberName = formData.get("memberName")

        const group = createGroup(groupName)
        addMemberToGroup(group, memberName);
        // const updatedGroup = addMemberToGroup(group, memberName);
        await saveGroup(group);
        startGroup(group);
        window.location.href = "/groups.html";
        console.log("Group ID:", group.id);
        console.log("Starting group:", group.name);
        console.log("Members:", group.members);
        console.log("Group name:", group.name);
        console.log("Member count:", group.members.length);
        console.log(
            "Members:",
            group.members.map(member => member.name)
        );
    })
})
// const group = await getExistingGroup();

// console.log(group);

// const group1 = createGroup("Sat Crew");

// console.log(group1);
// await clearGroups();
// const group = createGroup("Sat Crew");

// addMemberToGroup(group, "Sumit");
// addMemberToGroup(group, "Alex");


// await saveGroup(group);

// const loadedGroup = await getExistingGroup();

// console.log("Original:", group);
// console.log("Loaded:", loadedGroup);
// console.log("Same ID:", group.id === loadedGroup.id);

// let waterEvents = await getAllEvents();
// console.log("Beers since last water:", getBeersSinceLastWater(waterEvents));

// 
// const beer = createDrinkConsumedEvent("beer");

// await saveEvent(beer);

// console.log("Saved event:", beer);


// const events = await getAllEvents();
// console.log("All stored events:", events);

// for (const event of events) {
//     console.log("Event:", event);
//     console.log("Is valid event:", isValidDrinkConsumedEvent(event));
// }

// const drinkCounts = countDrinks(events);
// renderDrinkCounts(drinkCounts);
// // console.log("Created event:", beer);
// // console.log("Is valid event:", isValidDrinkConsumedEvent(beer));

// // const db = await openDatabase();

// // console.log("Database opened:", db.name);
// // console.log("Version:", db.version);
// // console.log("Stores:", [...db.objectStoreNames]);