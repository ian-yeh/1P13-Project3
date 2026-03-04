// storing the global state for the user
// i'm using zustand for this --> it's a state management tool so that info can persist across the WHOLE app
import { create } from 'zustand'

export const useUser = create((set) => ({
    userId: '',
    name: '',
    passengerNumber: '',
    mobilityDetails: '',
}))
