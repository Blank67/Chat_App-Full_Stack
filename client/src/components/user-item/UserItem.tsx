import { Avatar, Box, Text } from "@chakra-ui/react";

interface UserItemProps {
    user: {
        name: string;
        email: string;
        image: string;
    };
    handleFunction: () => void;
}

const UserItem = (props: UserItemProps) => {
    const { handleFunction, user } = props;
    return (
        <Box
            onClick={handleFunction}
            cursor="pointer"
            bg="#E8E8E8"
            _hover={{
                background: "#38B2AC",
                color: "white",
            }}
            w="100%"
            display="flex"
            alignItems="center"
            color="black"
            px={3}
            py={2}
            mb={2}
            borderRadius="lg"
        >
            <Avatar
                mr={2}
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.image}
            />
            <Box>
                <Text>{user.name}</Text>
                <Text fontSize="xs">
                    <b>Email : </b>
                    {user.email}
                </Text>
            </Box>
        </Box>
    );
};

export default UserItem;
