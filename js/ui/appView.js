export function renderDrinkCounts(drinkCounts) {
    const drinkCountsContainer = document.getElementById("drink-counts");

    drinkCountsContainer.innerHTML = ""; // Clear previous counts

    for (const [category, count] of Object.entries(drinkCounts)) {
        const countElement = document.createElement("div");
        const displayName = category === "beer" ? "🍺" : category;

        countElement.textContent = `${displayName} : ${count}`;
        drinkCountsContainer.appendChild(countElement);
    }
}