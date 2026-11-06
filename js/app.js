import { saveEvent, getAllEvents, clearEvents, getExistingGroup, saveGroup, clearGroups } from "./storage/eventStore.js";
import { createDrinkConsumedEvent, createGroup, addMemberToGroup, startGroup } from "./domain/events.js";
import { countDrinks } from "./domain/drinkSummary.js";
import { renderDrinkCounts } from "./ui/appView.js";
import { startGame } from "./games/core/gameEngine.js";
import { getGamesByMode } from "./games/core/gameRegistry.js";


async function render() {
    const events = await getAllEvents();
    const drinkCounts = countDrinks(events);
    console.log("drinkCounts:", drinkCounts);
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
    document.getElementById("group-form").hidden = true; // Hide the group form when resetting events
    await render();
});

await render(); // Initial render on page load

const gameContainer = document.getElementById("game-container");

if (gameContainer) {
    renderFeaturedSoloGames();
    gameContainer.addEventListener("click", (event) => {
        const gameButton = event.target.closest("[data-game-id]");
        if (!gameButton) return;

        startGame(gameButton.dataset.gameId, gameContainer, {
            onExit: renderFeaturedSoloGames
        });
        gameContainer.scrollIntoView({ behavior: "smooth", block: "center" });
    });
}

function renderFeaturedSoloGames() {
    const soloGames = getGamesByMode("solo");

    if (soloGames.length === 0) {
        gameContainer.innerHTML = `
            <article class="featured-game-card coming-soon">
                <span aria-hidden="true">🎮</span>
                <h3>Your first solo game is coming soon</h3>
                <p>Solo games you add to the registry will appear here.</p>
            </article>
        `;
        return;
    }

    gameContainer.innerHTML = soloGames.map(game => {
        const iconMarkup = game.icon.endsWith(".svg")
            ? `<img class="featured-game-icon" src="${game.icon}" alt="">`
            : `<span aria-hidden="true">${game.icon}</span>`;

        return `
            <article class="featured-game-card">
                ${iconMarkup}
                <h3>${game.name}</h3>
                <p>${game.description}</p>
                <button type="button" data-game-id="${game.id}">Play</button>
            </article>
        `;
    }).join("");
}

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
// Handle the Create a Group button
const startGroupButton = document.getElementById("create-a-group");
startGroupButton.addEventListener("click", async () => {
    // await clearGroups();
    const existingGroup = await getExistingGroup();
    if (existingGroup) {
        startGroup(existingGroup)
        return;
    }
    
    const groupForm = document.getElementById("group-form");
    groupForm.hidden = false;
    
    groupForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    })

    //  Handle group creation
    const createGroupForm = document.getElementById("create-group-form")
    createGroupForm.addEventListener("submit", async (event) => {
        
        event.preventDefault()
        // Get values from 2 inputs:
        // Create a FormData instance from the form element and value from "name" attribute
        const formData = new FormData(event.target);
        const groupName = formData.get("groupName")
        const memberName = formData.get("memberName")

        const group = createGroup(groupName)
        addMemberToGroup(group, memberName);
        await saveGroup(group);
        window.location.href = "groups.html";
    })
})
