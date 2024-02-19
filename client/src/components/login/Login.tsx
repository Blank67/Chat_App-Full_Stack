import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { post, setAxiosToken } from "../../utils/AxiosFetch";
import useCustomToast from "../../hooks/useCustomToast";
import { setUserData } from "../../redux/auth-slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";

const Login = () => {
    const showToast = useCustomToast();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.auth.user.token);
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
            showToast("Please fill all the details.");
            setIsLoading(false);
            return;
        }
        try {
            const data = await post("/user/login", formDetails);
            if (data.msg === "Success") {
                setAxiosToken(data.user.token);
                localStorage.setItem("userData", JSON.stringify(data.user));
                dispatch(setUserData(data.user));
                navigate("/chat");
            } else {
                showToast(data?.response?.data?.msg ?? "Something went wrong.");
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (token) {
            navigate("/chat");
        }
    }, [navigate, token]);
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
