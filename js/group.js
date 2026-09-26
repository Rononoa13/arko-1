import { getExistingGroup, saveGroup } from "./storage/eventStore.js";
import { addMemberToGroup } from "./domain/events.js";
import { deleteGroup } from "./storage/eventStore.js"

const group = await getExistingGroup();

function renderGroupName() {
    const groupName = document.getElementById("group-name")
    groupName.innerText = group.name

}

function renderMemberName() {
    const memberList = document.getElementById("group-members")
    memberList.innerHTML = "";

    const ul = document.createElement("ul")
    
    for (const member of group.members) {
        // memberName.innerText = member.name
        const li = document.createElement("li");
        li.innerText = member.name
        
        ul.appendChild(li)  
    }
    memberList.appendChild(ul)
}

renderGroupName();
renderMemberName();

// Application flow when adding a member !
const addMember = document.getElementById("add-member")
addMember.addEventListener("click", () => {
    const memberForm = document.getElementById("group-member-form");
    memberForm.hidden = false;
    addMember.hidden = true;
})
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
    console.log(deleteGroup(group.id))
    await deleteGroup(group.id);
    window.location.href = "/index.html";
});
