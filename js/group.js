import { getExistingGroup, saveGroup, deleteGroup, saveEvent, getAllEvents } from "./storage/eventStore.js";
import { addMemberToGroup } from "./domain/events.js";


const group = await getExistingGroup();

function renderGroupName() {
    const groupName = document.getElementById("group-name")
    groupName.innerText =`GROUP: ${group.name}`

}

async function renderMemberName() {
    const events = await getAllEvents();

    const memberList = document.getElementById("group-members")
    memberList.innerHTML = "";

    const ul = document.createElement("ul")

    for (const member of group.members) {
        const li = document.createElement("li");

        li.dataset.memberId = member.id;

        li.addEventListener("click", async () => {
            const event = {
                id: crypto.randomUUID(),
                type: "drink_consumed",
                category: "beer",
                groupId: group.id,
                memberId: member.id,
                timestamp: new Date().toISOString()
            };
            await saveEvent(event);

            await renderMemberName();
            await renderGroupTotal();
        });

        const memberName = document.createElement("span");
        memberName.innerText = `👤 ${member.name}`;

        const memberCount = document.createElement("span");
        const count = getMemberBeerCount(
            events,
            group.id,
            member.id
        )

        memberCount.innerText = `🍺 ${count}`;

        li.appendChild(memberName);
        li.appendChild(memberCount);

        ul.appendChild(li);
    }
    memberList.appendChild(ul);
}

async function renderGroupTotal() {
    const events = await getAllEvents();
    const groupBeerEvents = events.filter(event =>
        event.type === "drink_consumed" &&
        event.category === "beer" &&
        event.groupId === group.id
    );
    const total = groupBeerEvents.length;
    const groupTotal = document.getElementById("group-total")

    groupTotal.innerHTML = `
        <div class="group-divider"></div>
        <div class="group-total-count">
            <span>Total</span>
            <span>🍺 ${total}</span>
        </div>
    `;
}

renderGroupName();
renderMemberName();
renderGroupTotal();

// submit handler when adding a member
const addMemberForm = document.getElementById("add-member-form");

addMemberForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target)
    const memberName = formData.get("memberName");

    addMemberToGroup(group, memberName)
    
    await saveGroup(group)
    renderMemberName();

    addMemberForm.reset();
})

const removeGroup = document.getElementById("remove-group")
removeGroup.addEventListener("click", async () => {
    const confirmed = window.confirm(
        "Delete this group? This cannot be undone."
    );

    if (!confirmed) {
        return;
    }
    await deleteGroup(group.id);
    window.location.replace("/");
});

function getMemberBeerCount(events, groupId, memberId) {
    return events.filter(event =>
        event.type === "drink_consumed" &&
        event.category === "beer" &&
        event.groupId === groupId &&
        event.memberId === memberId
    ).length;
}