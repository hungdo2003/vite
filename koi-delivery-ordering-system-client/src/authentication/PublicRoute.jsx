
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// eslint-disable-next-line react/prop-types
const PublicRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const user = token ? jwtDecode(token) : null;

    // Check if user exists
    if (user) {
        return children;
    } else {
        // Redirect to login or another appropriate page
        return <Navigate to="/" />;
    }
};

export default PublicRoute;