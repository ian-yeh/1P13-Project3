// file to handle api calls to the backend

// eventData is a generic object cuz we still don't have a defined schema
export function scheduleEvent(eventData: any) {
    return fetch('http://localhost:8000/schedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })
    .then(response => response.json())
    .catch(error => console.error('Error scheduling event:', error));
}

export function getEvents() {
    return fetch('http://localhost:8000/events')
        .then(response => response.json())
        .catch(error => console.error('Error fetching events:', error));
}

export function updateUser(userData: any) {
    return fetch('http://localhost:8000/update_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .catch(error => console.error('Error updating user:', error));
}