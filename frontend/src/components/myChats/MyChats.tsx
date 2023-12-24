import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import useCustomToast from "../../hooks/useCustomToast";
import { get } from "../../utils/AxiosFetch";
import { setAllChats } from "../../redux/chat-slice/chatSlice";
import { useEffect, useRef } from "react";
import ChatItem from "../chatItem/ChatItem";
import GroupChatModal from "../groupChatModal/GroupChatModal";

const MyChats = () => {
    const chat = useSelector((state: RootState) => state.chat);
    const dispatch = useDispatch();
    const showToast = useCustomToast();

    //This is to avoid infinite fetch calls due to showToast in dependency array of useEffect
    const showToastRef = useRef(showToast);
    useEffect(() => {
        showToastRef.current = showToast;
    }, [showToast]);

    useEffect(() => {
        const fetchAllChats = async () => {
            try {
                const resposne = await get("/chat");
                if (resposne.msg === "Success") {
                    dispatch(setAllChats(resposne.chats));
                } else {
                    // showToast("Unable to fetch chats.");
                    showToastRef.current("Unable to fetch chats.");
                }
            } catch (error) {
                // showToast("Something went wrong.");
                showToastRef.current("Unable to fetch chats.");
            }
        };

        fetchAllChats();
    }, [dispatch]);
    return (
        <Box
            display={{ base: chat.selectedChat._id ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                <GroupChatModal>
                    <Button
                        display="flex"
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                <Stack overflowY="scroll">
                    {chat.allChats.map((chatItm) => (
                        <ChatItem key={chatItm._id} chatItm={chatItm} />
                    ))}
                </Stack>
            </Box>
        </Box>
    );
};

export default MyChats;
