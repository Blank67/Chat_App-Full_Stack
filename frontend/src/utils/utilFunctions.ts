import { decodeToken } from "react-jwt";

export const getSender = (loggedUser: any, chatUsers: any) => {
    const decryptedToken: any = decodeToken(loggedUser.token);
    return chatUsers[0]._id === decryptedToken.id
        ? chatUsers[1].name
        : chatUsers[0].name;
};
