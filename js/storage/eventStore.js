const DB_NAME = "drink-counter";
const DB_VERSION = 2;
const EVENT_STORE_NAME = "events";
const GROUP_STORE_NAME = "groups";


function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains(EVENT_STORE_NAME)) {
                db.createObjectStore(EVENT_STORE_NAME, { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains(GROUP_STORE_NAME)) {
                db.createObjectStore(GROUP_STORE_NAME, { keyPath: "id" });
            }
        };
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
}

export async function saveEvent(event) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(EVENT_STORE_NAME, "readwrite");
        const store = transaction.objectStore(EVENT_STORE_NAME);
        const request = store.add(event);

        request.onsuccess = () => {
            resolve(event);
        };
        request.onerror = () => {
            reject(request.error);
        };
    })
}

export async function getAllEvents() {
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(EVENT_STORE_NAME, "readonly");
        const store = transaction.objectStore(EVENT_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
}

export async function clearEvents() {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(EVENT_STORE_NAME, "readwrite");
        const store = transaction.objectStore(EVENT_STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => {
            resolve();
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
}
// Group Object Creation
export async function saveGroup(group) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(GROUP_STORE_NAME, "readwrite");
        const store = transaction.objectStore(GROUP_STORE_NAME);
        const request = store.add(group);

        request.onsuccess = () => {
            resolve(group);
        };
        request.onerror = () => {
            reject(request.error);
        };
    })
}

export async function getExistingGroup() {
    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(GROUP_STORE_NAME, "readonly");
        const store = transaction.objectStore(GROUP_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
        if (request.result.length > 0) {
            resolve(request.result[0]); // Because only 1 group
        } else {
            resolve(null);
            }
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
}

export { openDatabase };