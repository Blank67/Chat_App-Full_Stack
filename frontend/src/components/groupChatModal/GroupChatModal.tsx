import {
    Box,
    Button,
    FormControl,
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
import { ReactNode, useEffect, useRef, useState } from "react";
import useCustomToast from "../../hooks/useCustomToast";
import { useDispatch } from "react-redux";
import UserItem from "../userItem/UserItem";
import { get, post } from "../../utils/AxiosFetch";
import UserBadgeItem from "../userBadgeItem/UserBadgeItem";
import { UserInterface } from "../../utils/Interface";
import { addToAllChats } from "../../redux/chat-slice/chatSlice";

interface GroupChatModalProps {
    children: ReactNode;
}

const GroupChatModal = (props: GroupChatModalProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const showToast = useCustomToast();
    //This is to avoid infinite fetch calls due to showToast in dependency array of useEffect
    const showToastRef = useRef(showToast);
    useEffect(() => {
        showToastRef.current = showToast;
    }, [showToast]);
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<UserInterface[]>([]);
    const [searchText, setSearchText] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const createGroupHandler = async () => {
        if (!groupChatName || !selectedUsers) {
            showToastRef.current("Please fill all the feilds.");
            return;
        }
        try {
            const payload = {
                name: groupChatName,
                users: selectedUsers,
            };
            const response = await post("/chat/group", payload);

            if (response.msg === "Success") {
                dispatch(addToAllChats(response.groupChat));
                resetStates();
                showToastRef.current("Group Created", "success");
            } else {
                showToastRef.current(response.msg);
            }
        } catch (error) {
            showToastRef.current("Something went wrong.");
        }
    };
    const handleDelete = (userToRemove: UserInterface) => {
        setSelectedUsers(
            selectedUsers.filter((sel) => sel._id !== userToRemove._id)
        );
    };
    const handleGroup = (userToAdd: UserInterface) => {
        const exist = selectedUsers.find((user) => user._id === userToAdd._id);
        if (exist) {
            showToastRef.current("User already added.");
            return;
        }
        setSelectedUsers((prev) => [...prev, userToAdd]);
    };
    const resetStates = () => {
        setGroupChatName("");
        setSearchText("");
        setSelectedUsers([]);
        onClose();
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
            <span onClick={onOpen}>{props.children}</span>

            <Modal onClose={resetStates} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                    >
                        <FormControl>
                            <Input
                                placeholder="Group Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => {
                                    setGroupChatName(e.target.value);
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users eg: John, Piyush, Jane"
                                mb={1}
                                value={searchText}
                                onChange={(e) => {
                                    setSearchText(e.target.value);
                                }}
                            />
                        </FormControl>
                        <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedUsers.map((u: UserInterface) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>
                        {searchResult
                            ?.slice(0, 4)
                            .map((user: UserInterface) => (
                                <UserItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleGroup(user)}
                                />
                            ))}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            onClick={createGroupHandler}
                            isDisabled={
                                !groupChatName || selectedUsers.length === 0
                            }
                        >
                            Create Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default GroupChatModal;
