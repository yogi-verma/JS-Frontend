import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in
        const checkAuth = async () => {
            try {
                const res = await fetch('https://js-backend-olive.vercel.app/api/current_user', {
                    credentials: 'include'
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data && data.email) {
                        // User is logged in, redirect to dashboard
                        navigate('/dashboard');
                    }
                } else {
                    console.log('User not authenticated, status:', res.status);
                }
            } catch (err) {
                console.log('Error checking authentication:', err);
            }
        };

        // Add a small delay to ensure backend session is established
        const timer = setTimeout(checkAuth, 500);
        return () => clearTimeout(timer);
    }, [navigate]);

    const googleLogin = () => {
        window.open('https://js-backend-olive.vercel.app/auth/google', "_self");
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <button 
                onClick={googleLogin}
                className="px-6 py-2 bg-blue-500 text-white rounded-md"
            >
                Login with Google
            </button>
        </div>
    );
};

export default Home;
