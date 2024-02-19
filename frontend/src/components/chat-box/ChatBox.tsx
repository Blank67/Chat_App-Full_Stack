import { Box } from "@chakra-ui/layout";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ChatContent from "../chat-content/ChatContent";

const ChatBox = () => {
    const chat = useSelector((state: RootState) => state.chat);

    return (
        <Box
            display={{
                base: chat.selectedChat._id ? "flex" : "none",
                md: "flex",
            }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg="white"
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <ChatContent />
        </Box>
    );
};

export default ChatBox;
