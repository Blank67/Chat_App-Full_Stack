import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/1",
        element: <div>Hello1</div>,
    },
]);

function App() {
    return (
        <div className="root-div">
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
