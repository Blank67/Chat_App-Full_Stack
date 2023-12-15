import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/toast";
import { post } from "../../utils/AxiosFetch";

const Login = () => {
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formDetails, setFormDetails] = useState({
        email: "",
        password: "",
        showPassword: false,
    });
    const formChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormDetails((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const formSubmitHandler = async () => {
        setIsLoading(true);
        if (!formDetails.email || !formDetails.password) {
            toast({
                title: "Please fill all the details.",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setIsLoading(false);
            return;
        }
        try {
            const data = await post("/user/login", formDetails);
            if (data.msg === "Success") {
                console.log("Logged In!");
            } else {
                toast({
                    title: data?.response?.data?.msg ?? "Something went wrong.",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
            console.log(data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };
    return (
        <VStack spacing="10px">
            <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                    autoComplete="off"
                    name="email"
                    type="email"
                    placeholder="Enter Your Email Address"
                    value={formDetails.email}
                    onChange={formChangeHandler}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        autoComplete="off"
                        name="password"
                        type={formDetails.showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={formDetails.password}
                        onChange={formChangeHandler}
                    />
                    <InputRightElement width="4.5rem">
                        <Button
                            h="1.75rem"
                            size="sm"
                            onClick={() => {
                                setFormDetails((prev) => ({
                                    ...prev,
                                    showPassword: !prev.showPassword,
                                }));
                            }}
                        >
                            {formDetails.showPassword ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                onClick={formSubmitHandler}
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                isLoading={isLoading}
            >
                Login
            </Button>
            <Button
                variant="solid"
                colorScheme="red"
                width="100%"
                onClick={() => {
                    setFormDetails((prev) => ({
                        ...prev,
                        email: "guest01@gmail.com",
                        password: "Nwac@123",
                    }));
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    );
};

export default Login;
