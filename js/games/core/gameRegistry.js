/**
 * The registry is the foundation of the architecture.
    Its purpose is to answer:
        * Which games exist?
        * What are their IDs?
        * What information should the selection screen display?
 */

import * as friendlyArguments from "../catalog/friendlyArguments/index.js";


const games = [
    {
        id: "friendly-arguments",
        name: "Friendly Arguments",
        description: "Get a question and make your case.",
        icon: "🗣️",
        category: "conversation",
        mode: "group",
        minPlayers: 2,
        maxPlayers: null,
        requiresGroup: true,
        enabled: true,
        implementation: friendlyArguments
    }
];

export function getAllGames() {
    return games;
}

export function getGameById(gameId) {
    return games.find(game => game.id === gameId) ?? null;
}

export function getAvailableGames(context = {}) {
    return games.filter(game =>
        game.enabled &&
        (!game.requiresGroup || Boolean(context.group))
    );
}

export function getGamesByMode(mode, context = {}) {
    return getAvailableGames(context).filter(game => game.mode === mode);
}
