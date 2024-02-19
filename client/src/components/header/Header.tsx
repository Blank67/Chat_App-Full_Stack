import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
    Avatar,
    Box,
    Button,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetAuthSlice } from "../../redux/auth-slice/authSlice";
import { RootState } from "../../redux/store";
import {
    resetChatSlice,
    setSelectedChat,
} from "../../redux/chat-slice/chatSlice";
import { getSender } from "../../utils/utilFunctions";
import { resetNotificationSlice, setNotifications } from "../../redux/notification-slice/notificationSlice";
import ProfileModal from "../profile-modal/ProfileModal";


interface HeaderProps {
    onOpen: () => void;
}

const Header = (props: HeaderProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const notifications = useSelector(
        (state: RootState) => state.notification.notifications
    );
    const logoutHandler = () => {
        localStorage.removeItem("userData");
        dispatch(resetAuthSlice());
        dispatch(resetChatSlice());
        dispatch(resetNotificationSlice());
        navigate("/");
    };
    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bg="white"
            w="100%"
            p="5px 10px 5px 10px"
            borderWidth="5px"
        >
            <Tooltip
                label="Search Users to chat"
                hasArrow
                placement="bottom-end"
            >
                <Button variant="ghost" onClick={props.onOpen}>
                    <i className="fas fa-search"></i>
                    <Text display={{ base: "none", md: "flex" }} px={4}>
                        Search User
                    </Text>
                </Button>
            </Tooltip>
            <Text fontSize="2xl" fontFamily="Work sans">
                Talk-A-Tive
            </Text>
            <div>
                <Menu>
                    <MenuButton p={1}>
                        {/* TODO: ADD NOTIFICATION COUNT */}
                        <BellIcon fontSize="2xl" m={1} />
                    </MenuButton>
                    <MenuList pl={2}>
                        {!notifications.length && "No New Messages"}
                        {notifications.map((noti) => (
                            <MenuItem
                                key={noti._id}
                                onClick={() => {
                                    dispatch(setSelectedChat(noti.chat));
                                    dispatch(
                                        setNotifications(
                                            notifications.filter(
                                                (n) => n._id !== noti._id
                                            )
                                        )
                                    );
                                }}
                            >
                                {noti.chat.isGroupChat
                                    ? `New Message in ${noti.chat.chatName}`
                                    : `New Message from ${getSender(
                                          user,
                                          noti.chat.users
                                      )}`}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
                <Menu>
                    <MenuButton
                        as={Button}
                        bg="white"
                        rightIcon={<ChevronDownIcon />}
                    >
                        <Avatar
                            size="sm"
                            cursor="pointer"
                            name={user.name}
                            src={user.image}
                        />
                    </MenuButton>
                    <MenuList>
                        <ProfileModal user={user}>
                            <MenuItem>My Profile</MenuItem>
                        </ProfileModal>
                        <MenuDivider />
                        <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </Box>
    );
};

export default Header;
