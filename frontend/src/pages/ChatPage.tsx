import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/side-drawer/SideDrawer";
import MyChats from "../components/my-chats/MyChats";
import ChatBox from "../components/chat-box/ChatBox";

const ChatPage = () => {
    return (
        <div style={{ width: "100%" }}>
            <SideDrawer />
            <Box
                display="flex"
                justifyContent="space-between"
                w="100%"
                h="91.5vh"
                p="10px"
            >
                <MyChats />
                <ChatBox />
            </Box>
        </div>
    );
};

export default ChatPage;
