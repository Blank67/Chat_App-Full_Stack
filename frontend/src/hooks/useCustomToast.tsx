import { useToast } from "@chakra-ui/toast";

const useCustomToast = () => {
    const toast = useToast();
    const showToast = (
        title: string,
        status?:
            | "warning"
            | "info"
            | "success"
            | "error"
            | "loading"
            | undefined,
        duration?: number,
        isClosable?: boolean,
        position?:
            | "top"
            | "top-left"
            | "top-right"
            | "bottom"
            | "bottom-left"
            | "bottom-right"
    ) => {
        toast({
            title,
            status: status || "warning",
            duration: duration || 3000,
            isClosable: isClosable || true,
            position: position || "bottom",
        });
    };
    return showToast;
};

export default useCustomToast;
