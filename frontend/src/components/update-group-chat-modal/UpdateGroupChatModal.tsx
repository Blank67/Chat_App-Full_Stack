import { ViewIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    FormControl,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import useCustomToast from "../../hooks/useCustomToast";
import { UserInterface } from "../../utils/Interface";
import { get, put } from "../../utils/AxiosFetch";
import { setSelectedChat } from "../../redux/chat-slice/chatSlice";
import { reloadAllChats } from "../../redux/fetchAllChatsAgain-slice/fetchAllChatsAgainSlice";
import { decryptId } from "../../utils/utilFunctions";
import UserBadgeItem from "../user-badge-item/UserBadgeItem";
import UserItem from "../user-item/UserItem";

const UpdateGroupChatModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const chat = useSelector((state: RootState) => state.chat);
    const auth = useSelector((state: RootState) => state.auth);
    const [groupChatName, setGroupChatName] = useState("");
    const [searchText, setSearchText] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const showToast = useCustomToast();
    //This is to avoid infinite fetch calls due to showToast in dependency array of useEffect
    const showToastRef = useRef(showToast);
    useEffect(() => {
        showToastRef.current = showToast;
    }, [showToast]);

    const resetStates = () => {
        setGroupChatName("");
        setSearchText("");
        setSearchResult([]);
        onClose();
    };
    const handleAddUser = async (userToAdd: UserInterface) => {
        const exist = chat.selectedChat.users.find(
            (user: UserInterface) => user._id === userToAdd._id
        );
        if (exist) {
            showToastRef.current("User already in group.");
            return;
        }
        if (chat.selectedChat.groupAdmin._id !== decryptId(auth.user)) {
            showToastRef.current("Only admin can add users.");
            return;
        }
        try {
            const payload = {
                userId: userToAdd._id,
                chatId: chat.selectedChat._id,
            };
            const response = await put("/chat/group/add", payload);
            if ((response.msg = "Success")) {
                showToastRef.current("Update Successful!", "success");
                dispatch(setSelectedChat(response.chat));
                dispatch(reloadAllChats());
            } else {
                showToastRef.current(response.msg);
            }
        } catch (error) {
            showToastRef.current("Something went wrong.");
        }
    };
    const handleRemove = async (
        userToRemove: UserInterface,
        action: string
    ) => {
        if (action === "remove") {
            if (chat.selectedChat.groupAdmin._id !== decryptId(auth.user)) {
                showToastRef.current("Only admin can remove users.");
                return;
            }
        }
        try {
            const payload = {
                userId:
                    action === "remove"
                        ? userToRemove._id
                        : decryptId(userToRemove),
                chatId: chat.selectedChat._id,
            };
            debugger;
            const response = await put("/chat/group/remove", payload);
            if (response.msg === "Success") {
                if (userToRemove === auth.user) {
                    dispatch(setSelectedChat({}));
                } else {
                    dispatch(setSelectedChat(response.chat));
                }
                showToastRef.current("Update Successful!", "success");
                dispatch(reloadAllChats());
            } else {
                showToastRef.current(response.msg);
            }
        } catch (error) {
            showToastRef.current("Something went wrong.");
        }
    };
    const handleRename = async () => {
        if (!groupChatName) {
            return;
        }
        if (chat.selectedChat.groupAdmin._id !== decryptId(auth.user)) {
            showToastRef.current("Only admin can rename group.");
            return;
        }
        try {
            const payload = {
                chatId: chat.selectedChat._id,
                newGroupName: groupChatName,
            };
            const response = await put("/chat/group/rename", payload);
            if (response.msg === "Success") {
                showToastRef.current("Update Successful!", "success");
                dispatch(setSelectedChat(response.chat));
                dispatch(reloadAllChats());
            } else {
                showToastRef.current(response.msg);
            }
        } catch (error) {
            showToastRef.current("Something went wrong.");
        }
    };
    useEffect(() => {
        const searchUser = async () => {
            if (!searchText) return setSearchResult([]);
            try {
                const response = await get(`/user?search=${searchText}`);
                if (response.msg === "Success") {
                    setSearchResult(response.users);
                } else {
                    showToastRef.current(response.msg);
                }
            } catch (error) {
                showToastRef.current("Something went wrong.");
            }
        };

        const timerId = setTimeout(() => {
            searchUser();
        }, 800);
        return () => {
            clearTimeout(timerId);
        };
    }, [searchText]);
    return (
        <>
            <IconButton
                aria-label="View Icon"
                display={{ base: "flex" }}
                icon={<ViewIcon />}
                onClick={onOpen}
            />

            <Modal onClose={resetStates} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        {chat.selectedChat.chatName}
                    </ModalHeader>

                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                    >
                        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                            {chat.selectedChat.users.map((u: UserInterface) => {
                                if (u._id === decryptId(auth.user)) {
                                    return null;
                                } else {
                                    return (
                                        <UserBadgeItem
                                            key={u._id}
                                            user={u}
                                            admin={chat.selectedChat.groupAdmin}
                                            handleFunction={() =>
                                                handleRemove(u, "remove")
                                            }
                                        />
                                    );
                                }
                            })}
                        </Box>
                        <FormControl display="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) =>
                                    setGroupChatName(e.target.value)
                                }
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </FormControl>
                        {searchResult?.map((user: UserInterface) => (
                            <UserItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleAddUser(user)}
                            />
                        ))}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={() => handleRemove(auth.user, "leave")}
                            colorScheme="red"
                        >
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default UpdateGroupChatModal;
