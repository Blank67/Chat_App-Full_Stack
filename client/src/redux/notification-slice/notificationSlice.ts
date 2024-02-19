import { createSlice } from "@reduxjs/toolkit";

interface NotificationState {
    notifications: any[];
}

const initialState: NotificationState = {
    notifications: [],
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
        },
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        resetNotificationSlice: (state) => {
            state = initialState;
        },
    },
});

export const { setNotifications, addNotification, resetNotificationSlice } =
    notificationSlice.actions;

export default notificationSlice.reducer;
