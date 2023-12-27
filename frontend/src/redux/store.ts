import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/authSlice";
import loaderReducer from "./loader-slice/loaderSlice";
import chatReducer from "./chat-slice/chatSlice";
import fetchAllChatsAgainReducer from "./fetchAllChatsAgain-slice/fetchAllChatsAgainSlice";
import notificationReducer from "./notification-slice/notificationSlice";

export const store = configureStore({
    reducer: {
        loader: loaderReducer,
        auth: authReducer,
        chat: chatReducer,
        fetchAllChatsAgain: fetchAllChatsAgainReducer,
        notification: notificationReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself.
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsReducer, comments: CommentsReducer}
export type AppDispatch = typeof store.dispatch;
