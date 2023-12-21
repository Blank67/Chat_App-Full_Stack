import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/sideDrawer/SideDrawer";
import MyChats from "../components/myChats/MyChats";

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
            </Box>
        </div>
    );
};

export default ChatPage;
