export function renderDrinkCounts(drinkCounts) {
    const drinkCountsContainer = document.getElementById("drink-counts");

    drinkCountsContainer.innerHTML = ""; // Clear previous counts

    for (const [category, count] of Object.entries(drinkCounts)) {
        const countElement = document.createElement("div");
        countElement.textContent = `${category}: ${count}`;
        drinkCountsContainer.appendChild(countElement);
    }
}