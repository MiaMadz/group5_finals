import { createSlice } from '@reduxjs/toolkit'
 
const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: {
        items: [], 
    },
    reducers: {
        toggleFavorite: (state, action) => {
            const brewery = action.payload
            const exists = state.items.find(b => b.id === brewery.id)
            if (exists) {
                state.items = state.items.filter(b => b.id !== brewery.id)
            } else {
                state.items.push(brewery)
            }
        }
    }
})
 
export const { toggleFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer