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

const SignUp = () => {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
        cPassword: "",
        image: "",
    });
    const [passwordState, setPasswordState] = useState({
        password: false,
        cPassword: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const formChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };
    const imageUploadHandler = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setIsLoading(true);
            const image = files[0];
            if (image.type === "image/png") {
                const data = new FormData();
                data.append("file", image);
                data.append("upload_preset", "chat-app");
                data.append("cloud_name", "dgnlzft52");
                try {
                    const response = await fetch(
                        "https://api.cloudinary.com/v1_1/piyushproj/image/upload",
                        {
                            method: "post",
                            body: data,
                        }
                    );
                    const responseJSON = await response.json();
                    console.log(responseJSON);
                    setFormState((prev) => ({
                        ...prev,
                        image: responseJSON.url.toString() ?? "",
                    }));
                    setIsLoading(false);
                } catch (error) {
                    console.log(error);
                    setIsLoading(false);
                    toast({
                        title: "Something went wrong. Please try again.",
                        status: "warning",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom",
                    });
                    return;
                }
            } else {
                toast({
                    title: "Please select an image!",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                setIsLoading(false);
                return;
            }
        } else {
            toast({
                title: "Something went wrong!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setIsLoading(false);
            return;
        }
    };
    const formSubmitHandler = async () => {
        setIsLoading(true);
        if (
            !formState.name ||
            !formState.email ||
            !formState.password ||
            !formState.cPassword
        ) {
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
        if (formState.password !== formState.cPassword) {
            toast({
                title: "Passwords do not match.",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setIsLoading(false);
            return;
        }
        try {
            const data = await post("/user", formState);
            if (data.msg === "Success") {
                toast({
                    title: "Registration Successful",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            } else {
                toast({
                    title: data?.response?.data?.msg ?? "Something went wrong.",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
            setIsLoading(false);
        } catch (error) {}
    };
    return (
        <VStack spacing="5px">
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    name="name"
                    placeholder="Enter Your Name"
                    value={formState.name}
                    onChange={formChangeHandler}
                />
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                    name="email"
                    type="email"
                    placeholder="Enter Your Email Address"
                    value={formState.email}
                    onChange={formChangeHandler}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        name="password"
                        type={passwordState.password ? "text" : "password"}
                        placeholder="Enter Password"
                        value={formState.password}
                        onChange={formChangeHandler}
                    />
                    <InputRightElement width="4.5rem">
                        <Button
                            h="1.75rem"
                            size="sm"
                            onClick={() => {
                                setPasswordState((prev) => ({
                                    ...prev,
                                    password: !prev.password,
                                }));
                            }}
                        >
                            {passwordState.password ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        name="cPassword"
                        type={passwordState.cPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={formState.cPassword}
                        onChange={formChangeHandler}
                    />
                    <InputRightElement width="4.5rem">
                        <Button
                            h="1.75rem"
                            size="sm"
                            onClick={() => {
                                setPasswordState((prev) => ({
                                    ...prev,
                                    cPassword: !prev.cPassword,
                                }));
                            }}
                        >
                            {passwordState.cPassword ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic">
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={imageUploadHandler}
                />
            </FormControl>
            <Button
                isLoading={isLoading}
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={formSubmitHandler}
            >
                Sign Up
            </Button>
        </VStack>
    );
};

export default SignUp;
