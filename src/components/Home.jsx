const Home = () => {
    const googleLogin = () => {
        window.open('http://localhost:5000/auth/google', "_self");
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
