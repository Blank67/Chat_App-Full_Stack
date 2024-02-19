import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Input,
    useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import useCustomToast from "../../hooks/useCustomToast";
import { get, post } from "../../utils/AxiosFetch";
import Header from "../header/Header";
import {
    addToAllChats,
    setSelectedChat,
} from "../../redux/chat-slice/chatSlice";
import { RootState } from "../../redux/store";
import UserItem from "../user-item/UserItem";

const SideDrawer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const showToast = useCustomToast();
    const allChats = useSelector((state: RootState) => state.chat.allChats);
    const [searchText, setSearchText] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const searchHandler = async () => {
        if (!searchText) {
            showToast("Please Enter something in search");
            return;
        }
        try {
            const response = await get(`/user?search=${searchText}`);
            if (response.msg === "Success") {
                setSearchResult(response.users);
            } else {
                showToast(response.msg);
            }
        } catch (error) {
            showToast("Something went wrong.");
        }
    };
    const openChat = async (userId: string) => {
        try {
            const response = await post("/chat", { userId });
            if (response.msg === "Success") {
                if (!allChats.find((chat) => chat._id === response.chat._id)) {
                    dispatch(addToAllChats(response.chat));
                }
                dispatch(setSelectedChat(response.chat));
                onClose();
                setSearchResult([]);
                setSearchText("");
            } else {
                showToast(response.msg);
            }
        } catch (error) {
            showToast("Something went wrong.");
        }
    };
    const closeDrawer = () => {
        onClose();
        setSearchResult([]);
        setSearchText("");
    };
    return (
        <>
            <Header onOpen={onOpen} />
            <Drawer placement="left" onClose={closeDrawer} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">
                        Search Users
                    </DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                            <Button onClick={searchHandler}>Go</Button>
                        </Box>
                        {searchResult?.map((user: any) => (
                            <UserItem
                                key={user._id}
                                user={user}
                                handleFunction={() => openChat(user._id)}
                            />
                        ))}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default SideDrawer;
