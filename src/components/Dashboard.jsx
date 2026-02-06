import { useEffect, useState, useRef } from "react";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/current_user', {
            credentials: 'include'
        })
            .then(res => {
                if (res.status === 401) {
                    window.location.href = '/';
                    return null;
                }
                return res.json();
            })
            .then(data => {
                if (data) setUser(data);
            });
    }, []);

    const logout = () => {
        window.open('http://localhost:5000/auth/logout', "_self");
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!user) return <div className="h-screen flex justify-center items-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
                <div className="text-2xl font-bold text-blue-600">MyApp</div>
                <div className="relative" ref={dropdownRef}>
                    <img 
                        src={user.photo}
                        alt="Profile"
                        onClick={toggleDropdown}
                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300 hover:border-blue-500"
                    />
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
                            <button 
                                onClick={logout}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Welcome Message */}
            <div className="p-8">
                <h1 className="text-3xl font-semibold text-gray-800">
                    Welcome, {user.displayName} 👋
                </h1>
                <p className="mt-2 text-gray-600">
                    Email: {user.email}
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
