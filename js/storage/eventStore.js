const DB_NAME = "drink-counter";
const DB_VERSION = 1;
const EVENT_STORE_NAME = "events";


function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains(EVENT_STORE_NAME)) {
                db.createObjectStore(EVENT_STORE_NAME, { keyPath: "id" });
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

export { openDatabase };