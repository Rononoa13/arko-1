import { getGameById } from "./gameRegistry.js";

let activeGame = null;

export function startGame(gameId, container, context = {}) {
    const game = getGameById(gameId);
    if (!game) {
        throw new Error(`Game with ID "${gameId}" not found.`);
    }
    if (!container) {
        throw new Error("Container element is required to start the game.");
    }
    if (game.requiresGroup && !context.group) {
        throw new Error(`Game "${game.name}" requires a group context.`);
    }

    // Stop any currently active game.
    if (activeGame) {
        stopGame();
    }

    const onExit = () => {
        stopGame();
        context.onExit?.();
    };

    const instance = game.implementation.start({ container, context, onExit }) ?? {};
    activeGame = { id: gameId, instance, container };

    return activeGame;
}

export function stopGame() {
    if (!activeGame) {
        return;
    }
    activeGame.instance?.stop();
    activeGame.container.replaceChildren(); // Clear the container
    activeGame = null;
}

export function getActiveGame() {
    return activeGame;
}
