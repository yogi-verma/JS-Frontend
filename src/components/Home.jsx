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
import LearningCards from "./LearningCards/LearningCards";
import OutputBasedPromoStrip from "./FeatureLaunchBanner/OutputBasedPromoStrip";
import AnimatedBackground from "./AnimatedBackground/AnimatedBackground";

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
        <div className={`relative min-h-screen flex flex-col overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <AnimatedBackground isDark={isDark} />
            <div className="relative z-10 flex flex-col flex-1">
            <Header />

            <OutputBasedPromoStrip onLoginRequired={initializeGoogleLogin} />

            <Section
                showLoginButton={!isAuthenticated}
                onLoginClick={initializeGoogleLogin}
            />

            <LearningCards onLoginRequired={initializeGoogleLogin} />

            <Reason />

            <SpecialButton />

            <Footer />
            </div>
        </div>
    );
};

export default Home;
