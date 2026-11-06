export function start({ container, onExit }) {
    const controller = new AbortController();
    const svgNamespace = "http://www.w3.org/2000/svg";
    let currentGamma = null;
    let centerGamma = null;

    const game = document.createElement("div");
    game.className = "game-card chungi-game";

    const stage = document.createElement("div");
    stage.className = "chungi-player-stage";
    stage.setAttribute("role", "button");
    stage.setAttribute("tabindex", "0");
    stage.setAttribute("aria-label", "Stick figure movement area. Tap to kick.");

    const stickFigure = document.createElementNS(svgNamespace, "svg");
    stickFigure.setAttribute("viewBox", "0 0 100 140");
    stickFigure.setAttribute("width", "42");
    stickFigure.setAttribute("height", "59");
    stickFigure.setAttribute("role", "img");
    stickFigure.setAttribute("aria-label", "A simple stick figure");
    stickFigure.setAttribute("shape-rendering", "crispEdges");

    const head = document.createElementNS(svgNamespace, "circle");
    head.setAttribute("cx", "50");
    head.setAttribute("cy", "22");
    head.setAttribute("r", "12");
    head.setAttribute("fill", "none");

    const bodyAndArms = document.createElementNS(svgNamespace, "path");
    bodyAndArms.setAttribute(
        "d",
        "M50 34 V82 M50 48 L22 68 M50 48 L78 68"
    );

    const standingLeg = document.createElementNS(svgNamespace, "path");
    standingLeg.setAttribute("d", "M50 82 L28 116");

    const kickingLeg = document.createElementNS(svgNamespace, "path");
    kickingLeg.setAttribute("d", "M50 82 L72 116");
    kickingLeg.classList.add("chungi-kicking-leg");

    stickFigure.append(head, bodyAndArms, standingLeg, kickingLeg);
    stickFigure.setAttribute("fill", "none");
    stickFigure.setAttribute("stroke", "#121412");
    stickFigure.setAttribute("stroke-width", "10");
    stickFigure.setAttribute("stroke-linecap", "square");
    stickFigure.setAttribute("stroke-linejoin", "miter");
    stickFigure.classList.add("chungi-player");
    stage.append(stickFigure);

    const status = document.createElement("p");
    status.className = "chungi-tilt-status";
    status.setAttribute("aria-live", "polite");
    status.textContent = "Starting centered. Tilt your phone left or right to move.";

    const exitButton = document.createElement("button");
    exitButton.type = "button";
    exitButton.className = "chungi-exit";
    exitButton.textContent = "← Back to games";
    exitButton.addEventListener("click", onExit, { signal: controller.signal });

    game.append(stage, status, exitButton);
    container.replaceChildren(game);

    stage.addEventListener("click", kick, { signal: controller.signal });
    stage.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        kick();
    }, { signal: controller.signal });

    startTilt();

    return {
        stop() {
            controller.abort();
            game.remove();
        }
    };

    function startTilt() {
        if (typeof DeviceOrientationEvent === "undefined") {
            status.textContent = "This browser does not provide tilt sensors.";
            return;
        }

        window.addEventListener("deviceorientation", onOrientation, {
            signal: controller.signal
        });

        if (typeof DeviceOrientationEvent.requestPermission === "function") {
            DeviceOrientationEvent.requestPermission()
                .then(permission => {
                    if (permission !== "granted") {
                        status.textContent = "Motion access is blocked. Allow it in Safari settings to use tilt.";
                    }
                })
                .catch(() => {
                    status.textContent = "Waiting for motion access. This browser may require a user gesture the first time.";
                });
        }
    }

    function onOrientation(event) {
        if (typeof event.gamma !== "number") return;
        currentGamma = event.gamma;

        if (centerGamma === null) {
            centerGamma = currentGamma;
            status.textContent = "Centered. Tilt to move; tap the play area to kick.";
        }

        const maxOffset = Math.max(0, (stage.clientWidth - stickFigure.width.baseVal.value) / 2);
        const offset = Math.max(-maxOffset, Math.min(maxOffset, (currentGamma - centerGamma) * 2.5));
        stickFigure.style.setProperty("--chungi-offset", `${offset}px`);
    }

    function kick() {
        stickFigure.classList.remove("is-kicking");
        void stickFigure.getBoundingClientRect();
        stickFigure.classList.add("is-kicking");
    }
}
