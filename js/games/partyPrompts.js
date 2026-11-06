import { getGamesByMode } from "./core/gameRegistry.js";
import { startGame } from "./core/gameEngine.js";
import { getExistingGroup } from "../storage/eventStore.js";

const gameSession = document.getElementById("game-container");
const group = await getExistingGroup();

if (gameSession) {
    gameSession.addEventListener("click", (event) => {
        if (event.target.closest("#play-game")) {
            renderGameSelector();
            return;
        }

        if (event.target.closest("#close-game-selector")) {
            renderPlayButton();
            return;
        }

        const gameButton = event.target.closest("[data-game-id]");
        if (gameButton) {
            startSelectedGame(gameButton.dataset.gameId);
        }
    });
}

function renderPlayButton() {
    gameSession.innerHTML = '<button id="play-game" type="button">🎮 Ready to play?</button>';
}

function renderGameSelector() {
    const games = getGamesByMode("group", { group });
    if (!group || games.length === 0) {
        gameSession.innerHTML = `
            <div class="game-selector">
                <button id="close-game-selector" type="button" aria-label="Close game selection">✕</button>
                <h2>No group games are available yet</h2>
            </div>
        `;
        return;
    }
    gameSession.innerHTML = `
        <div id="game-modal">
            <div class="game-selector">
                <button id="close-game-selector" type="button" aria-label="Close game selection">✕</button>
                <h2>Choose a game</h2>
                <div id="game-list">
                    ${games.map(game => `
                        <button class="game-option" type="button" data-game-id="${game.id}">
                            <span>${game.icon}</span>
                            <span>${game.name}</span>
                        </button>
                    `).join("")}
                </div>
            </div>
        </div>
    `;
}

function startSelectedGame(gameId) {
    startGame(gameId, gameSession, {
        group,
        onExit: renderGameSelector
    });
    gameSession.scrollIntoView({ behavior: "smooth", block: "start" });
}
