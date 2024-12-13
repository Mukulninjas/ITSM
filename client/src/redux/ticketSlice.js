import { createSlice } from '@reduxjs/toolkit';

const ticketSlice = createSlice({
    name: 'tickets',
    initialState: {
        tickets: [],
        loading: false,
        error: null
    },
    reducers: {
        fetchTicketsRequest(state) {
            state.loading = true;
            state.error = null;
        },
        fetchTicketsSuccess(state, action) {
            state.tickets = action.payload;
            state.loading = false;
        },
        fetchTicketsFailure(state, action) {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const { fetchTicketsRequest, fetchTicketsSuccess, fetchTicketsFailure } = ticketSlice.actions;
export default ticketSlice.reducer;