// file to handle api calls to the backend
import { Platform } from "react-native";

let API_HOST = "http://127.0.0.1:8000";

// for android people - they use a different port ig
if (Platform.OS === 'android') {
    API_HOST = "http://10.0.2.2:8000"
};

//const API_BASE_URL = `${API_HOST}/api`;
const API_BASE_URL = process.env.EXPO_PUBLIC_BASE_API_URL;

export function scheduleEvent(eventData: any) {
    return fetch(`${API_BASE_URL}/create_event`, {
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
export function getEvents(userId: string) {
    return fetch(`${API_BASE_URL}/get_events/${userId}`)
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
