import "./Loader.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Loader = () => {
    const isLoading = useSelector((state: RootState) => state.loader.loading);
    if (!isLoading) {
        return null;
    }
    return (
        <div id="global_loader_placeholder">
            <div className="spinner">
                <div className="spinner-border" role="status">
                    <span className="sr-only hidden">Loading...</span>
                </div>
            </div>
        </div>
    );
};

export default Loader;
