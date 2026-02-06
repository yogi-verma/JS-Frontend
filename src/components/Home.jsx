import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in
        fetch('https://js-backend-olive.vercel.app/api/current_user', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                if (data && data.email) {
                    // User is logged in, redirect to dashboard
                    navigate('/dashboard');
                }
            })
            .catch(err => {
                // User not logged in, stay on home page
                console.log('Not authenticated', err);
            });
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
