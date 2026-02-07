import { useEffect, useState } from 'react';
import colors from '../../utils/color';
import { useTheme } from '../../utils/WhiteDarkMode/useTheme';
import ThemeToggle from '../../utils/WhiteDarkMode/ThemeToggle';
import Hamburger from '../../utils/HamBurger/Hamburger';
import { getCurrentUser, initializeGoogleLogin } from '../../utils/BackendCalls/authService';
import logo from "../../assets/logo.png";

const Header = () => {
	const { isDark } = useTheme();
	const [user, setUser] = useState(null);

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
			className={`text-gray-800 border-b shadow-sm ${isDark ? 'text-gray-100' : ''}`}
		>
			<div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
				<div className="flex items-center">
					<img
						src={logo}
						alt="Logo"
						className="object-contain w-10 h-10"
					/>
					<div>
						<h1 className={`text-md font-semibold ${colors.blueTextGradient}`}>DevCrux</h1>
						<p className={`text-xs opacity-90 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Full Stack Solution</p>
					</div>
				</div>

				{/* Desktop nav — hidden on small screens */}
				{/* <nav className="hidden md:flex items-center gap-4">
					{user ? (
						<div className="flex items-center gap-3">
							{user.photo ? (
								<img
									src={user.photo}
									alt="Profile"
									title={user.displayName}
									className={`w-10 h-10 rounded-full border-2 shadow-md ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
								/>
							) : (
								<div
									className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white border-2 shadow-md"
									style={{
										background: colors.blueLight,
										borderColor: isDark ? '#374151' : '#E0E7FF'
									}}
									title={user.displayName}
								>
									{getInitials(user.displayName)}
								</div>
							)}
						</div>
					) : (
						<button
							onClick={initializeGoogleLogin}
							className={`transition cursor-pointer font-medium ${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}
						>
							Dashboard
						</button>
					)}
					<ThemeToggle />
				</nav> */}

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
