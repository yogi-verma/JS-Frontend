import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from './Header/Header';
import signupImage from '../assets/signup.png';
import colors from '../utils/color';
import { useTheme } from '../utils/WhiteDarkMode/useTheme';
import { getCurrentUser, initializeGoogleLogin } from '../utils/BackendCalls/authService';

const Home = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();

    useEffect(() => {
        // Check if user is already logged in
        const checkAuth = async () => {
            try {
                const user = await getCurrentUser();
                if (user && user.email) {
                    // User is logged in, redirect to dashboard
                    navigate('/dashboard');
                }
            } catch (err) {
                console.log('Error checking authentication:', err);
            }
        };

        // Add a small delay to ensure backend session is established
        const timer = setTimeout(checkAuth, 500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <Header />

            <main className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-4xl">
                    <div 
                        className="rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row items-center"
                        style={{
                            background: isDark 
                                ? `linear-gradient(135deg, #1F2937, #111827)`
                                : `linear-gradient(135deg, ${colors.blueLight}10, ${colors.blueMid}10)`,
                            border: `1px solid ${isDark ? '#374151' : colors.blueLighter || '#E0E7FF'}`
                        }}
                    >
                        {/* Left Side - Image */}
                        <div className="md:w-1/2 w-full">
                            <img 
                                src={signupImage} 
                                alt="Sign up" 
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Right Side - Login Section */}
                        <div 
                            className="md:w-1/2 w-full p-8 md:p-12 flex flex-col justify-center items-center"
                        >
                            <h2 className={`text-3xl font-bold mb-2 text-center ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Welcome</h2>
                            <p className={`text-center mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Sign in to your account to continue</p>

                            <button 
                                onClick={initializeGoogleLogin}
                                className="w-full px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg hover:cursor-pointer hover:scale-105 shadow-md"
                                style={{
                                    background: `linear-gradient(90deg, ${colors.blueLight}, ${colors.blueMid})`
                                }}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Login with Google
                                </span>
                            </button>

                            <p className={`text-sm mt-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                We use OAuth 2.0 for secure authentication
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
