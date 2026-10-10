import { renderGroupName, renderMemberName, renderGroupTotal } from "../group.js"

const friendlyArguments = [
    {
        id: 1,
        type: "friendly_argument",
        prompt: "What's more important: money or free time?"
    },

    {
        id: 2,
        type: "friendly_argument",
        prompt: "Would you rather have $1M today or $5M in 10 years?"
    },

    {
        type: "friendly_argument",
        prompt: "Is it okay to ghost someone after one date?"
    },

    {
        id: 3,
        type: "friendly_argument",
        prompt: "Should friends always tell each other the truth?"
    },

    {
        id: 4,
        type: "friendly_argument",
        prompt: "Is being late rude or normal?"
    },

    {
        id: 5,
        type: "friendly_argument",
        prompt: "Would you rather have an amazing career or an amazing social life?"
    },

    {
        id: 6,
        type: "friendly_argument",
        prompt: "Is it better to travel alone or with friends?"
    },

    {
        id: 7,
        type: "friendly_argument",
        prompt: "Can you be friends with your ex?"
    },

    {
        id: 8,
        type: "friendly_argument",
        prompt: "Would you rather be famous or extremely wealthy but anonymous?"
    },

    {
        id: 9,
        type: "friendly_argument",
        prompt: "Is 'I'll pay you back' actually a promise?"
    }
];

const gameSession = document.getElementById("game-session");
const playGameButton = document.getElementById("play-game");

// function showGameSeletor() {
//     gameSession.innerHTML = `
//         <h2>Choose a game</h2>

//         <button id="friendly-arguments" type="button">
//             🗣️ Friendly Arguments
//         </button>
//     `;
// }

playGameButton.addEventListener("click", showGameSelector);

function startFriendlyArguments() {
    gameSession.innerHTML = `
        <div class="game-card">
            <button id="back-to-game" type="button">
                ← Back to game
            </button>

            <h2>🗣️ Friendly Arguments</h2>
            <p id="argument-prompt"></p>

            <button id="next-argument" type="button">
                Next
            </button>
        </div>
    `;
    showArgument();
    document
        .getElementById("next-argument")
        .addEventListener("click", showArgument);

    document
        .getElementById("back-to-game")
        .addEventListener("click", showGameSelector);
}


function showArgument() {
    const prompt = document.getElementById("argument-prompt");

    const randomIndex = Math.floor(Math.random() * friendlyArguments.length);

    prompt.textContent = friendlyArguments[randomIndex].prompt;
}


function showGameSelector() {
    console.log("showGameSelector called");
    const existingModal = document.getElementById("game-modal");
    // If the modal already exists, just show it
    if (existingModal) {
        console.log("Game modal already exists, showing it.");
        existingModal.hidden = false;
        return;
    }

    gameSession.innerHTML = `
        <div id="game-modal">
            <div class="game-selector">
                <button
                    id="close-game-selector"
                    type="button"
                    aria-label="Close game selection"
                >
                    ✕
                </button>
                <h2>Choose a game</h2>
                <button id="friendly-arguments" type="button">
                    🗣️ Friendly Arguments
                </button>
            </div>
        </div>
    `;

    document
        .getElementById("friendly-arguments")
        .addEventListener("click", startFriendlyArguments);
    document
        .getElementById("close-game-selector")
        .addEventListener("click", closeGameSelector);
}

function closeGameSelector() {
    console.log("closeGameSelector called");
    gameSession.innerHTML = `
        <button id="play-game" type="button">🎮 Play a game</button>
    `;
    document
        .getElementById("play-game")
        .addEventListener("click", showGameSelector);
    // const gameModal = document.getElementById("game-modal");
    // if (gameModal) {
    //     gameModal.hidden = true;
    // }
}
// document
//     .getElementById("close-game-selector")
//     .addEventListener("click", showParty);

// function showParty() {
//     // render the group interface
//     renderGroupName();
//     renderMemberName();
//     renderGroupTotal();
// }