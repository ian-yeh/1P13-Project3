// storing the global state for the user
// i'm using zustand for this --> it's a state management tool so that info can persist across the WHOLE app
import { create } from 'zustand'

interface UserState {
    userId: string;
    name: string;
    passengerNumber: string;
    mobilityDetails: string;
}

export const useUser = create<UserState>((set) => ({
    userId: '',
    name: '',
    passengerNumber: '',
    mobilityDetails: '',
}))
