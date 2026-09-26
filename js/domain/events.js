const DRINK_CATEGORIES = [
    "beer",
    "other",
    "water"
];

export function createDrinkConsumedEvent(category, timestamp = new Date()) {
    if (!DRINK_CATEGORIES.includes(category)) {
        throw new Error(`Invalid drink category: ${category}`);
    }

    return {
        id: crypto.randomUUID(),
        type: "drink_consumed",
        category,
        timestamp: timestamp.toISOString()
    };
}

export function isValidDrinkConsumedEvent(event) {
    if (!event || typeof event !== "object") {
        return false;
    }
    if (typeof event.id !== "string" || event.id.length === 0) {
        return false;
    }
    if (event.type !== "drink_consumed") {
        return false;
    }
    if (!DRINK_CATEGORIES.includes(event.category)) {
        return false;
    }
    if (typeof event.timestamp !== "string" || isNaN(Date.parse(event.timestamp))) {
        return false;
    }
    return true;
}

// Group Domain
export function createGroup(groupName) {

    return {
        id: crypto.randomUUID(),
        name: groupName,
        members: []
    };
}

export function addMemberToGroup(group, memberName) {
    const member = {
        id: crypto.randomUUID(),
        name: memberName
    };
    group.members.push(member)
    return group
}

export function startGroup(group) {
    console.log("Starting group:", group.name);
    console.log("Members:", group.members);
    for (const member of group.members) {
        console.log("Member:", member.name)
    }
}