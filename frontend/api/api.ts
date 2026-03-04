// file to handle api calls to the backend

const API_BASE_URL = 'http://localhost:8000/api';

export function scheduleEvent(eventData: any) {
    return fetch(`${API_BASE_URL}/schedule`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })
    .then(response => response.json())
    .catch(error => console.error('Error scheduling event:', error));
}

// get all events attached to a specific user
// TODO: fetch via specific user, not in total.
export function getEvents() {
    return fetch(`${API_BASE_URL}/events`)
        .then(response => response.json())
        .catch(error => console.error('Error fetching events:', error));
}

// updating user details in db, using user ID that is stored in the userData object
export function updateUser(userId: string, userData: any) {
    return fetch(`${API_BASE_URL}/update_user/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .catch(error => console.error('Error updating user:', error));
}

// fetching user details from db, via user id
export function getUser(userId: string) {
    return fetch(`${API_BASE_URL}/get_user/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .catch(error => console.error('Error fetching user:', error));
}
