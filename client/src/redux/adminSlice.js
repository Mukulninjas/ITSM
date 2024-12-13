import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    permissions: [],
    users: []
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setPermissions(state, action) {
            state.permissions = action.payload;
        },
        setUsers(state, action) {
            state.users = action.payload;
        }
    }
});

export const { setPermissions, setUsers } = adminSlice.actions;
export default adminSlice.reducer;