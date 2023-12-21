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
import { post } from "../../utils/AxiosFetch";
import useCustomToast from "../../hooks/useCustomToast";

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
    const showToast = useCustomToast();
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
                    setFormState((prev) => ({
                        ...prev,
                        image: responseJSON.url.toString() ?? "",
                    }));
                    setIsLoading(false);
                } catch (error) {
                    setIsLoading(false);
                    showToast("Something went wrong. Please try again");
                    return;
                }
            } else {
                showToast("Please select an image");
                setIsLoading(false);
                return;
            }
        } else {
            showToast("Something went wrong");
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
            showToast("Please fill all the details");
            setIsLoading(false);
            return;
        }
        if (formState.password !== formState.cPassword) {
            showToast("Passwords do not match");
            setIsLoading(false);
            return;
        }
        try {
            const data = await post("/user", formState);
            if (data.msg === "Success") {
                showToast("Registration Successful", "success");
            } else {
                showToast(data?.response?.data?.msg ?? "Something went wrong.");
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
