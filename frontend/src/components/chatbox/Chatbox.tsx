import { Box } from "@chakra-ui/layout";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const ChatBox = () => {
    const chat = useSelector((state: RootState) => state.chat);

    return (
        <Box
            display={{ base: chat.selectedChat._id ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg="white"
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            CHAT BOX
        </Box>
    );
};

export default ChatBox;
