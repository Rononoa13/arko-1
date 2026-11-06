export function start({ container, onExit }) {
    const controller = new AbortController();
    const svgNamespace = "http://www.w3.org/2000/svg";
    let currentGamma = null;
    let centerGamma = null;

    const game = document.createElement("div");
    game.className = "game-card chungi-game";

    const stage = document.createElement("div");
    stage.className = "chungi-player-stage";
    stage.setAttribute("aria-label", "Stick figure movement area");

    const stickFigure = document.createElementNS(svgNamespace, "svg");
    stickFigure.setAttribute("viewBox", "0 0 100 140");
    stickFigure.setAttribute("width", "32");
    stickFigure.setAttribute("height", "45");
    stickFigure.setAttribute("role", "img");
    stickFigure.setAttribute("aria-label", "A simple stick figure");
    stickFigure.setAttribute("shape-rendering", "crispEdges");

    const head = document.createElementNS(svgNamespace, "circle");
    head.setAttribute("cx", "50");
    head.setAttribute("cy", "22");
    head.setAttribute("r", "12");
    head.setAttribute("fill", "none");

    const bodyAndLimbs = document.createElementNS(svgNamespace, "path");
    bodyAndLimbs.setAttribute(
        "d",
        "M50 34 V82 M50 48 L22 68 M50 48 L78 68 M50 82 L28 116 M50 82 L72 116"
    );

    stickFigure.append(head, bodyAndLimbs);
    stickFigure.setAttribute("fill", "none");
    stickFigure.setAttribute("stroke", "currentColor");
    stickFigure.setAttribute("stroke-width", "10");
    stickFigure.setAttribute("stroke-linecap", "square");
    stickFigure.setAttribute("stroke-linejoin", "miter");
    stickFigure.classList.add("chungi-player");
    stage.append(stickFigure);

    const controls = document.createElement("div");
    controls.className = "chungi-tilt-controls";

    const calibrateButton = document.createElement("button");
    calibrateButton.type = "button";
    calibrateButton.textContent = "Calibrate center";
    calibrateButton.disabled = true;

    const status = document.createElement("p");
    status.className = "chungi-tilt-status";
    status.setAttribute("aria-live", "polite");
    status.textContent = "Starting centered. Tilt your phone left or right to move.";

    controls.append(calibrateButton);

    const exitButton = document.createElement("button");
    exitButton.type = "button";
    exitButton.className = "chungi-exit";
    exitButton.textContent = "← Back to games";
    exitButton.addEventListener("click", onExit, { signal: controller.signal });

    game.append(stage, controls, status, exitButton);
    container.replaceChildren(game);

    calibrateButton.addEventListener("click", calibrate, { signal: controller.signal });
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
            calibrateButton.disabled = false;
            status.textContent = "Centered. Tilt left and right to move the sprite.";
        }

        const maxOffset = Math.max(0, (stage.clientWidth - stickFigure.width.baseVal.value) / 2);
        const offset = Math.max(-maxOffset, Math.min(maxOffset, (currentGamma - centerGamma) * 5));
        stickFigure.style.setProperty("--chungi-offset", `${offset}px`);
    }

    function calibrate() {
        if (currentGamma === null) return;
        centerGamma = currentGamma;
        stickFigure.style.setProperty("--chungi-offset", "0px");
        status.textContent = "Calibrated. Tilt left and right to move the sprite.";
    }
}
