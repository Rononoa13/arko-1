import { getExistingGroup, saveGroup, deleteGroup } from "./storage/eventStore.js";
import { addMemberToGroup } from "./domain/events.js";


const group = await getExistingGroup();

function renderGroupName() {
    const groupName = document.getElementById("group-name")
    groupName.innerText =`GROUP: ${group.name}`

}

function renderMemberName() {
    const memberList = document.getElementById("group-members")
    memberList.innerHTML = "";

    const ul = document.createElement("ul")
    
    for (const member of group.members) {
        // memberName.innerText = member.name
        const li = document.createElement("li");
        li.innerText = `👤 ${member.name}  🍺 0`
        
        ul.appendChild(li)  
    }
    memberList.appendChild(ul)
}

function renderGroupTotal() {
    const groupTotal = document.getElementById("group-total")

    groupTotal.innerHTML = `
        <div class="group-divider"></div>
        <div class="group-total-count">Total  🍺 0</div>
    `
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
