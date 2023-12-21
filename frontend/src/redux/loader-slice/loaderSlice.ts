import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface LoaderState {
    loading: boolean;
}

const initialState: LoaderState = {
    loading: false,
};

const loaderSlice = createSlice({
    name: "loader",
    initialState,
    reducers: {
        toggleLoader: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { toggleLoader } = loaderSlice.actions;

export default loaderSlice.reducer;
