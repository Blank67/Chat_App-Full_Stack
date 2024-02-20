import {
    RouterProvider,
    createBrowserRouter,
    useNavigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import Loader from "./components/loader/Loader";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useEffect } from "react";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/chat",
        element: (
            <ProtectedRoute>
                <ChatPage />
            </ProtectedRoute>
        ),
    },
    { path: "*", element: <NotFoundRedirect /> },
]);

function NotFoundRedirect() {
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.auth.user.token);
    useEffect(() => {
        token ? navigate("/chat") : navigate("/");
    }, [token, navigate]);
    return null;
}

function ProtectedRoute({ children }: any) {
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.auth.user.token);
    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [navigate, token]);
    return children;
}

function App() {
    return (
        <div className="root-div">
            <RouterProvider router={router} />
            <Loader />
        </div>
    );
}

export default App;
