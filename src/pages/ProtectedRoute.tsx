import { Navigate, Outlet } from "react-router-dom";
import { tokenStorage } from "../utils/tokenStorage";

const ProtectedRoute = () => {
    const token = tokenStorage.getAccess();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;