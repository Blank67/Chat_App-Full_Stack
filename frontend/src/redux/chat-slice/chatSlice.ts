import { createSlice } from "@reduxjs/toolkit";

interface ChatState {
    selectedChat: any;
    allChats: any[];
}

const initialState: ChatState = {
    selectedChat: {},
    allChats: [],
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        },
        setAllChats: (state, action) => {
            state.allChats = action.payload;
        },
        addToAllChats: (state, action) => {
            state.allChats.unshift(action.payload);
        },
        resetChatSlice: (state) => {
            state = initialState;
        },
    },
});

export const { setSelectedChat, setAllChats, addToAllChats, resetChatSlice } =
    chatSlice.actions;

export default chatSlice.reducer;
