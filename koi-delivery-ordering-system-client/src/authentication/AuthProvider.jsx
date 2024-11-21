import { createContext, useContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({
    handleLogin: (token) => { },
    handleLogout: () => { }
})

// eslint-disable-next-line react/prop-types
function AuthProvider({ children }) {
    const handleLogin = (token) => {
        localStorage.setItem("token", token);
        const tokenData = token ? jwtDecode(token) : null;
        localStorage.setItem("userData", JSON.stringify(tokenData.userData));
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
    }

    return (
        <AuthContext.Provider value={{ handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext)
}
