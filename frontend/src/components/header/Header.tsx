import { ChevronDownIcon } from "@chakra-ui/icons";
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
import ProfileModal from "../sideDrawer/profileModal/ProfileModal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetUserData } from "../../redux/auth-slice/authSlice";
import { RootState } from "../../redux/store";

interface HeaderProps {
    onOpen: () => void;
}

const Header = (props: HeaderProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const logoutHandler = () => {
        localStorage.removeItem("userData");
        dispatch(resetUserData());
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
                {/* <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notif) => (
                                <MenuItem key={notif._id}>
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(
                                              user,
                                              notif.chat.users
                                          )}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu> */}
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
