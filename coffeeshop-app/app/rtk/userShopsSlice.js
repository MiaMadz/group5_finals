import { createSlice } from '@reduxjs/toolkit'

const userShopsSlice = createSlice({
    name: 'userShops',
    initialState: {
        items: [],
    },
    reducers: {
        addShop: (state, action) => {
            const shop = {
                ...action.payload,
                id: `shop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            }
            state.items.push(shop)
        },
        deleteShop: (state, action) => {
            state.items = state.items.filter(shop => shop.id !== action.payload)
        },
        updateShop: (state, action) => {
            const index = state.items.findIndex(shop => shop.id === action.payload.id)
            if (index !== -1) {
                state.items[index] = action.payload
            }
        }
    }
})

export const { addShop, deleteShop, updateShop } = userShopsSlice.actions
export default userShopsSlice.reducer
