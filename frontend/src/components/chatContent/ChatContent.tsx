import {
    Avatar,
    Box,
    FormControl,
    Input,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { setSelectedChat } from "../../redux/chat-slice/chatSlice";
import {
    decryptId,
    getSender,
    getSenderInfo,
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from "../../utils/utilFunctions";
import ProfileModal from "../profileModal/ProfileModal";
import { IconButton } from "@chakra-ui/react";
import UpdateGroupChatModal from "../updateGroupChatModal/UpdateGroupChatModal";
import { useEffect, useRef, useState } from "react";
import { get, post } from "../../utils/AxiosFetch";
import useCustomToast from "../../hooks/useCustomToast";
import "./ChatContent.scss";
import ScrollableFeed from "react-scrollable-feed";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import Lottie from "lottie-react";
import typingAnimationData from "../../assets/animations/typing.json";

interface ScrollableChatProps {
    messages: any[];
}

const ScrollableChat = (props: ScrollableChatProps) => {
    const { messages } = props;
    const auth = useSelector((state: RootState) => state.auth);

    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => (
                    <div style={{ display: "flex" }} key={m._id}>
                        {(isSameSender(messages, m, i, auth.user) ||
                            isLastMessage(messages, i, auth.user)) && (
                            <Tooltip
                                label={m.sender.name}
                                placement="bottom-start"
                                hasArrow
                            >
                                <Avatar
                                    mt="7px"
                                    mr={1}
                                    size="sm"
                                    cursor="pointer"
                                    name={m.sender.name}
                                    src={m.sender.pic}
                                />
                            </Tooltip>
                        )}
                        <span
                            style={{
                                backgroundColor: `${
                                    m.sender._id === decryptId(auth.user)
                                        ? "#BEE3F8"
                                        : "#B9F5D0"
                                }`,
                                marginLeft: isSameSenderMargin(
                                    messages,
                                    m,
                                    i,
                                    auth.user
                                ),
                                marginTop: isSameUser(messages, m, i) ? 3 : 10,
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                            }}
                        >
                            {m.content}
                        </span>
                    </div>
                ))}
        </ScrollableFeed>
    );
};

//SOCKET START
const ENDPOINT = "http://localhost:9090";
let socketIO: Socket<DefaultEventsMap, DefaultEventsMap>,
    selectedChatCompare: any;
//SOCKET END

const ChatContent = () => {
    const dispatch = useDispatch();
    const chat = useSelector((state: RootState) => state.chat);
    const auth = useSelector((state: RootState) => state.auth);
    const showToast = useCustomToast();
    //This is to avoid infinite fetch calls due to showToast in dependency array of useEffect
    const showToastRef = useRef(showToast);
    useEffect(() => {
        showToastRef.current = showToast;
    }, [showToast]);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const lottieStyle = {
        width: 70,
        marginBottom: 15,
        marginLeft: 0,
    };

    const sendMessageHandler = async (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter" && newMessage) {
            try {
                const payload = {
                    msg: newMessage,
                    chatId: chat.selectedChat._id,
                };
                setNewMessage("");
                socketIO.emit("stop_typing", chat.selectedChat._id);
                const response = await post("/message", payload);
                if (response.msg === "Success") {
                    setMessages([...messages, response.message]);
                    socketIO.emit("new_message", response.message);
                } else {
                    showToastRef.current(
                        "Something went wrong.",
                        null,
                        1500,
                        null,
                        "top"
                    );
                }
            } catch (error) {
                showToastRef.current(
                    "Something went wrong.",
                    null,
                    1500,
                    null,
                    "top"
                );
            }
        }
    };
    const typingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        console.log("kjsnd", socketConnected);

        if (!socketConnected) return;
        if (!typing) {
            setTyping(true);
            socketIO.emit("typing", chat.selectedChat._id);
        }
        const lastTypingTime = new Date().getTime();
        const timerLength = 3000;
        setTimeout(() => {
            const timeNow = new Date().getTime();
            const timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socketIO.emit("stop_typing", chat.selectedChat._id);
            }
            setTyping(false);
        }, timerLength);
    };

    //CREATE CONNECTION TO SOCET IO START
    useEffect(() => {
        socketIO = io(ENDPOINT);
        socketIO.emit("setup", decryptId(auth.user));
        socketIO.on("connected", () => {
            setSocketConnected(true);
        });
        socketIO.on("typing", () => {
            setIsTyping(true);
        });
        socketIO.on("stop_typing", () => {
            setIsTyping(false);
        });
    }, [auth.user]);
    //CREATE CONNECTION TO SOCET IO END
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await get(`/message/${chat.selectedChat._id}`);
                if (response.msg === "Success") {
                    setMessages(response.messages);
                    socketIO.emit("join_chat", chat.selectedChat._id);
                }
            } catch (error) {
                showToastRef.current(
                    "Something went wrong.",
                    null,
                    1500,
                    null,
                    "top"
                );
            }
        };

        if (chat.selectedChat._id) {
            fetchChats();
            selectedChatCompare = chat.selectedChat;
        }
    }, [chat.selectedChat, chat.selectedChat._id]);
    useEffect(() => {
        socketIO.on("message_received", (newMessageReceived) => {
            if (
                !selectedChatCompare._id ||
                selectedChatCompare._id !== newMessageReceived.chat._id
            ) {
                //TODO: Give notification
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        });
    });

    return chat.selectedChat._id ? (
        <>
            <Text
                fontSize={{ base: "28px", md: "30px" }}
                pb={3}
                px={2}
                w="100%"
                fontFamily="Work sans"
                display="flex"
                justifyContent={{ base: "space-between" }}
                alignItems="center"
            >
                <IconButton
                    aria-label="Back Button"
                    display={{ base: "flex", md: "none" }}
                    icon={<ArrowBackIcon />}
                    onClick={() => dispatch(setSelectedChat({}))}
                />

                {!chat.selectedChat.isGroupChat ? (
                    <>
                        {getSender(auth.user, chat.selectedChat.users)}
                        <ProfileModal
                            user={getSenderInfo(
                                auth.user,
                                chat.selectedChat.users
                            )}
                        />
                    </>
                ) : (
                    <>
                        {chat.selectedChat.chatName.toUpperCase()}
                        <UpdateGroupChatModal />
                    </>
                )}
            </Text>
            <Box
                display="flex"
                flexDir="column"
                justifyContent="flex-end"
                p={3}
                bg="#E8E8E8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                <div className="messages">
                    <ScrollableChat messages={messages} />
                </div>

                <FormControl onKeyDown={sendMessageHandler} isRequired mt={3}>
                    {isTyping ? (
                        <div>
                            <Lottie
                                animationData={typingAnimationData}
                                style={lottieStyle}
                            />
                        </div>
                    ) : (
                        <></>
                    )}
                    <Input
                        variant="filled"
                        bg="#E0E0E0"
                        placeholder="Enter a message.."
                        value={newMessage}
                        onChange={typingHandler}
                    />
                </FormControl>
            </Box>
        </>
    ) : (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            h="100%"
        >
            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                Click on a user to start chatting
            </Text>
        </Box>
    );
};

export default ChatContent;
