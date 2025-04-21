import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/UseAuthForm";

export const useAuthActions = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        navigate('/');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        navigate('/auth');
    };

    return { handleLoginSuccess, handleLogout };
};