/**
 * The registry is the foundation of the architecture.
    Its purpose is to answer:
        * Which games exist?
        * What are their IDs?
        * What information should the selection screen display?
    
    lists games and their metadata. 
    A game marked mode: "solo" is eligible for the Featured Solo Games section.
 */

import * as friendlyArguments from "../catalog/friendlyArguments/index.js";
import * as nepalTrivia from "../catalog/nepalTrivia/index.js";
import * as chungi from "../catalog/chungi/index.js";

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
    },
    {
        id: "nepal-trivia",
        name: "Nepal Trivia",
        description: "Test your knowledge of Nepal.",
        icon: "🇳🇵",
        category: "education",
        mode: "solo",
        minPlayers: 1,
        maxPlayers: 1,
        requiresGroup: false,
        enabled: true,
        implementation: nepalTrivia
    },
    {
        id: "chungi",
        name: "Chungi",
        description: "A simple foot-kicking dexterity game.",
        icon: "/js/games/catalog/chungi/chungi.svg",
        category: "dexterity",
        mode: "solo",
        minPlayers: 1,
        maxPlayers: 1,
        requiresGroup: false,
        enabled: true,
        implementation: chungi
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
