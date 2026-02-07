import { useEffect, useState } from 'react';
import colors from '../../utils/color';
import { useTheme } from '../../utils/WhiteDarkMode/useTheme';
import ThemeToggle from '../../utils/WhiteDarkMode/ThemeToggle';
import { getCurrentUser, initializeGoogleLogin } from '../../utils/BackendCalls/authService';

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
				<div className="flex items-center gap-3">
					<div 
						className="w-10 h-10 rounded-md flex items-center justify-center shadow-md" 
						style={{ background: isDark ? colors.blueDark : colors.blueLight }}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.656 1.344-3 3-3s3 1.344 3 3-1.344 3-3 3-3-1.344-3-3zM3 21v-2a4 4 0 014-4h6" />
						</svg>
					</div>
					<div>
						<h1 className={`text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>MyApp</h1>
						<p className={`text-xs opacity-90 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Simple OAuth Login</p>
					</div>
				</div>

				<nav className="flex items-center gap-4">
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
				</nav>
			</div>
		</header>
	);
};

export default Header;
