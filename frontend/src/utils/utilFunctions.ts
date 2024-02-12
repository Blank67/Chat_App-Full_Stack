import { decodeToken } from "react-jwt";

export const getSender = (loggedUser: any, chatUsers: any) => {
    const decryptedToken: any = decodeToken(loggedUser.token);
    return chatUsers[0]._id === decryptedToken.id
        ? chatUsers[1].name
        : chatUsers[0].name;
};
export const getSenderInfo = (loggedUser: any, chatUsers: any) => {
    const decryptedToken: any = decodeToken(loggedUser.token);
    return chatUsers[0]._id === decryptedToken.id ? chatUsers[1] : chatUsers[0];
};
export const decryptId = (user: any) => {
    const decryptToken: any = decodeToken(user.token);
    return decryptToken.id ?? "";
};

export const isSameSender = (
    allMessages: any[],
    currentMessage: any,
    currentMessageIndex: number,
    loggedInUser: any
) => {
    const userId = decryptId(loggedInUser);
    return (
        currentMessageIndex < allMessages.length - 1 &&
        (allMessages[currentMessageIndex + 1].sender._id !==
            currentMessage.sender._id ||
            allMessages[currentMessageIndex + 1].sender._id === undefined) &&
        allMessages[currentMessageIndex].sender._id !== userId
    );
};
export const isLastMessage = (
    allMessages: any[],
    currentMessageIndex: number,
    loggedInUser: any
) => {
    const userId = decryptId(loggedInUser);
    return (
        currentMessageIndex === allMessages.length - 1 &&
        allMessages[allMessages.length - 1].sender._id !== userId &&
        allMessages[allMessages.length - 1].sender._id
    );
};
export const isSameSenderMargin = (
    allMessages: any[],
    currentMessage: any,
    currentMessageIndex: number,
    loggedInUser: any
) => {
    const userId = decryptId(loggedInUser);
    if (
        currentMessageIndex < allMessages.length - 1 &&
        allMessages[currentMessageIndex + 1].sender._id ===
            currentMessage.sender._id &&
        allMessages[currentMessageIndex].sender._id !== userId
    )
        return 33;
    else if (
        (currentMessageIndex < allMessages.length - 1 &&
            allMessages[currentMessageIndex + 1].sender._id !==
                currentMessage.sender._id &&
            allMessages[currentMessageIndex].sender._id !== userId) ||
        (currentMessageIndex === allMessages.length - 1 &&
            allMessages[currentMessageIndex].sender._id !== userId)
    )
        return 0;
    else return "auto";
};
export const isSameUser = (
    allMessages: any[],
    currentMessage: any,
    currentMessageIndex: number
) => {
    return (
        currentMessageIndex > 0 &&
        allMessages[currentMessageIndex - 1].sender._id ===
            currentMessage.sender._id
    );
};
