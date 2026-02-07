import { useEffect, useState } from "react";
import { useTheme } from "../utils/WhiteDarkMode/useTheme";
import Header from "./Header/Header";
import Section from "./Section/Section";
import Reason from "./Reason/Reason";
import Loader from "../utils/Loader/Loader";
import { getCurrentUser, logout as logoutUser } from "../utils/BackendCalls/authService";

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

    const handleLogout = () => {
        logoutUser();
    };

    if (!user) return <div className={`h-screen flex justify-center items-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}><Loader /></div>;

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
            <Header />
            
            <Section />

            <Reason />
            {/* Welcome Message */}
            <div className="p-8">
                <h1 className={`text-3xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>  Welcome, {user.displayName} 👋  </h1>
                <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>  Email: {user.email}  </p>
                <button
                    onClick={handleLogout}
                    className={`mt-6 px-6 py-2 rounded-lg font-medium transition ${isDark ? 'bg-red-900 text-red-100 hover:bg-red-800' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                >  Logout  </button>
            </div>
        </div>
    );
};

export default Dashboard;
