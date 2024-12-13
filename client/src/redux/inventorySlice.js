import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    laptops: [],
    desktops: [],
    dismantle: [],
    accessories: [],
    phonesAndTabs: [],
    networkDevices: [],
    servers: [],
};

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        setLaptops(state, action) {
            state.laptops = action.payload;
        },
        setDesktops(state, action) {
            state.desktops = action.payload;
        },
        setDismantle(state, action) {
            state.dismantle = action.payload;
        },
        setAccessories(state, action) {
            state.accessories = action.payload;
        },
        setPhonesAndTabs(state, action) {
            state.phonesAndTabs = action.payload;
        },
        setNetworkDevices(state, action) {
            state.networkDevices = action.payload;
        },
        setServers(state, action) {
            state.servers = action.payload;
        },
        addItem(state, action) {
            const { category, item } = action.payload;
            state[category].push(item);
        },
        updateItem(state, action) {
            const { category, id, updatedItem } = action.payload;
            state[category] = state[category].map(item =>
                item.id === id ? updatedItem : item
            );
        },
        deleteItem(state, action) {
            const { category, id } = action.payload;
            state[category] = state[category].filter(item => item.id !== id);
        },
    },
});

export const { setLaptops, setDesktops, setDismantle, setAccessories, setPhonesAndTabs, setNetworkDevices, setServers, addItem, updateItem, deleteItem } = inventorySlice.actions;
export default inventorySlice.reducer;
