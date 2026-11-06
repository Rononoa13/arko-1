import { friendlyArguments } from "./data.js";

export function start({ container, onExit }) {
    const controller = new AbortController();
    let previousIndex = -1;

    const card = document.createElement("article");
    card.className = "game-card";

    const title = document.createElement("h2");
    title.textContent = "🗣️ Friendly Arguments";

    const prompt = document.createElement("p");
    prompt.id = "argument-prompt";
    prompt.setAttribute("aria-live", "polite");

    const nextButton = document.createElement("button");
    nextButton.id = "next-argument";
    nextButton.type = "button";
    nextButton.textContent = "🔄 Get another prompt";
    nextButton.addEventListener("click", showPrompt, { signal: controller.signal });

    const exitButton = document.createElement("button");
    exitButton.type = "button";
    exitButton.textContent = "← Back to games";
    exitButton.addEventListener("click", onExit, { signal: controller.signal });

    card.append(title, prompt, nextButton, exitButton);
    container.replaceChildren(card);
    showPrompt();

    return {
        stop() {
            controller.abort();
        }
    };

    function showPrompt() {
        if (friendlyArguments.length === 0) return;

        let nextIndex = Math.floor(Math.random() * friendlyArguments.length);
        if (friendlyArguments.length > 1) {
            while (nextIndex === previousIndex) {
                nextIndex = Math.floor(Math.random() * friendlyArguments.length);
            }
        }
        previousIndex = nextIndex;
        prompt.textContent = friendlyArguments[nextIndex].prompt;
    }
}
