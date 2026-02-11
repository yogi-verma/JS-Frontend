import { useEffect, useState } from "react";
import { useTheme } from "../utils/WhiteDarkMode/useTheme";
import Header from "./Header/Header";
import Section from "./Section/Section";
import Reason from "./Reason/Reason";
import Modules from "./Modules/Modules";
import Loader from "../utils/Loader/Loader";
import { getCurrentUser } from "../utils/BackendCalls/authService";
import Footer from "./Footer/Footer";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const { isDark } = useTheme();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getCurrentUser();
                if (user) {
                    setUser(user);
                } else {
                    // User not authenticated, redirect to home
                    window.location.href = '/';
                }
            } catch (err) {
                console.error('Error fetching user:', err);
                window.location.href = '/';
            }
        };
        
        fetchUser();
    }, []);

    if (!user) return <div className={`h-screen flex justify-center items-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}><Loader /></div>;

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
            <Header />
            
            <Section />
            
            <Modules />

            <Reason />

            <Footer />

        </div>
    );
};

export default Dashboard;
