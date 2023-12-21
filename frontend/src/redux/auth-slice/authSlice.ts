import { createSlice } from "@reduxjs/toolkit";

const createInitialState = () => {
    const data = localStorage.getItem("userData");
    if (data) {
        return JSON.parse(data);
    }
    return { name: "", email: "", image: "", token: "" };
};

const initialState = {
    user: createInitialState(),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.user = action.payload;
        },
        resetUserData: (state) => {
            state.user = createInitialState();
        },
    },
});

export const { setUserData, resetUserData } = authSlice.actions;
export default authSlice.reducer;
