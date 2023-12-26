import { createSlice } from "@reduxjs/toolkit";

interface FetchAllChatsAgain {
    refresh: boolean;
}

const initialState: FetchAllChatsAgain = {
    refresh: false,
};

const fetchAllChatsAgainSlice = createSlice({
    name: "fetch all chats again",
    initialState,
    reducers: {
        reloadAllChats: (state) => {
            state.refresh = !state.refresh;
        },
    },
});

export const { reloadAllChats } = fetchAllChatsAgainSlice.actions;

export default fetchAllChatsAgainSlice.reducer;
