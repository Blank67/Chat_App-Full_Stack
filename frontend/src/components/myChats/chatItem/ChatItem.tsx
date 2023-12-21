import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setSelectedChat } from "../../../redux/chat-slice/chatSlice";
import { getSender } from "../../../utils/utilFunctions";

interface ChatItemProps {
    chatItm: any;
}

const ChatItem = (props: ChatItemProps) => {
    const { chatItm } = props;
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);
    const chat = useSelector((state: RootState) => state.chat);

    return (
        <Box
            onClick={() => dispatch(setSelectedChat(chatItm))}
            cursor="pointer"
            bg={chat.selectedChat._id === chatItm._id ? "#38B2AC" : "#E8E8E8"}
            color={chat.selectedChat._id === chatItm._id ? "white" : "black"}
            px={3}
            py={2}
            borderRadius="lg"
        >
            <Text>
                {!chatItm.isGroupChat
                    ? getSender(auth.user, chatItm.users)
                    : chatItm.chatName}
            </Text>
            {chatItm.latestMessage && (
                <Text fontSize="xs">
                    <b>{chatItm.latestMessage.sender.name} : </b>
                    {chatItm.latestMessage.content.length > 50
                        ? chatItm.latestMessage.content.substring(0, 51) + "..."
                        : chatItm.latestMessage.content}
                </Text>
            )}
        </Box>
    );
};

export default ChatItem;
