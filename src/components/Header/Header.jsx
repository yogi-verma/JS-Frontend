import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import colors from '../../utils/color';
import { useTheme } from '../../utils/WhiteDarkMode/useTheme';
import ThemeToggle from '../../utils/WhiteDarkMode/ThemeToggle';
import Hamburger from '../../utils/HamBurger/Hamburger';
import { getCurrentUser, initializeGoogleLogin } from '../../utils/BackendCalls/authService';
import logo from "../../assets/logo.png";

const Header = () => {
	const { isDark } = useTheme();
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const user = await getCurrentUser();
				if (user) {
					setUser(user);
				}
			} catch (err) {
				console.error('Error fetching user:', err);
			}
		};

		fetchUser();
	}, []);

	const getInitials = (displayName) => {
		if (!displayName) return '?';
		return displayName.charAt(0).toUpperCase();
	};

	return (
		<header
			style={{
				background: isDark ? '#1F2937' : colors.white,
				borderColor: isDark ? '#374151' : '#E0E7FF'
			}}
			className={`sticky top-0 z-50 text-gray-800 border-b shadow-sm ${isDark ? 'text-gray-100' : ''}`}
		>
			<div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
				<div className="flex items-center">
					<img
						src={logo}
						alt="Logo"
						className="object-contain w-10 h-10"
					/>
					<div>
						<h1
							className={`text-md font-semibold ${colors.blueTextGradient} cursor-pointer`}
							onClick={() => navigate('/dashboard')}
						>
							DevCrux
						</h1>
						<p className={`text-xs opacity-90 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Full Stack Solution</p>
					</div>
				</div>

				{/* Hamburger — visible on small screens; opens drawer with user photo + theme */}
				<div>
					<Hamburger
						user={user}
						getInitials={getInitials}
						onLoginClick={initializeGoogleLogin}
					/>
				</div>
			</div>
		</header>
	);
};

export default Header;
