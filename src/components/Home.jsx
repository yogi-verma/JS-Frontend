import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from './Header/Header';
import { useTheme } from '../utils/WhiteDarkMode/useTheme';
import { useUser } from '../utils/UserContext/UserContext';
import { initializeGoogleLogin } from '../utils/BackendCalls/authService';
import Section from "./Section/Section";
import Footer from "./Footer/Footer";
import Reason from "./Reason/Reason";
import SpecialButton from "./SpecialButton/SpecialButton";

const Home = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const { isAuthenticated, loading } = useUser();

    useEffect(() => {
        // If user is logged in, redirect to dashboard
        if (!loading && isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, loading, navigate]);

    return (
        <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <Header />

            <Section
                showLoginButton={!isAuthenticated}
                onLoginClick={initializeGoogleLogin}
            />

            <Reason />

            <SpecialButton />

            <Footer />
        </div>
    );
};

export default Home;
