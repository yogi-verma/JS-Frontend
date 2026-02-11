import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from './Header/Header';
import { useTheme } from '../utils/WhiteDarkMode/useTheme';
import { getCurrentUser, initializeGoogleLogin } from '../utils/BackendCalls/authService';
import Section from "./Section/Section";
import Footer from "./Footer/Footer";
import Reason from "./Reason/Reason";
import SpecialButton from "./SpecialButton/SpecialButton";

const Home = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is already logged in
        const checkAuth = async () => {
            try {
                const user = await getCurrentUser();
                if (user && user.email) {
                    setIsLoggedIn(true);
                    // User is logged in, redirect to dashboard
                    navigate('/dashboard');
                } else {
                    setIsLoggedIn(false);
                }
            } catch (err) {
                console.log('Error checking authentication:', err);
                setIsLoggedIn(false);
            }
        };

        // Add a small delay to ensure backend session is established
        const timer = setTimeout(checkAuth, 500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <Header />

            <Section
                showLoginButton={!isLoggedIn}
                onLoginClick={initializeGoogleLogin}
            />

            <Reason />

            <SpecialButton />

            <Footer />
        </div>
    );
};

export default Home;
