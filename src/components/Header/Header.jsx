import { useNavigate } from 'react-router-dom';
import { FiZap } from 'react-icons/fi';
import colors from '../../utils/color';
import { useTheme } from '../../utils/WhiteDarkMode/useTheme';
import { useUser } from '../../utils/UserContext/UserContext';
import ThemeToggle from '../../utils/WhiteDarkMode/ThemeToggle';
import Hamburger from '../../utils/HamBurger/Hamburger';
import { initializeGoogleLogin } from '../../utils/BackendCalls/authService';
import logo from "../../assets/logo.png";

const Header = () => {
	const { isDark } = useTheme();
	const { user, currentStreak } = useUser();
	const navigate = useNavigate();

	const getInitials = (displayName) => {
		if (!displayName) return '?';
		return displayName.charAt(0).toUpperCase();
	};

	return (
		<header
			className={`w-full max-w-full overflow-hidden text-gray-800 shadow-sm py-1 sm:py-2 ${isDark ? 'text-gray-100' : ''}`}
		>
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
				<div className="flex items-center">
					<img
						src={logo}
						alt="Logo"
						className="object-contain w-8 h-8"
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

				{/* Streak badge + Hamburger */}
				<div className="ml-auto flex items-center gap-3">
					{/* Streak Icon */}
					<button
						onClick={() => navigate('/dashboard/profile', { state: { tab: 'streak' } })}
						className="relative flex items-center gap-1 rounded-full px-2.5 py-1.5 transition-all duration-300 cursor-pointer"
						style={{
							background: currentStreak > 0
								? (isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.1)')
								: (isDark ? 'rgba(107,114,128,0.15)' : 'rgba(107,114,128,0.08)'),
							border: `1px solid ${currentStreak > 0
								? (isDark ? 'rgba(245,158,11,0.3)' : 'rgba(245,158,11,0.25)')
								: (isDark ? 'rgba(107,114,128,0.2)' : 'rgba(107,114,128,0.15)')}`,
							boxShadow: currentStreak > 0
								? (isDark ? '0 0 12px rgba(245,158,11,0.25), 0 0 4px rgba(245,158,11,0.15)' : '0 0 10px rgba(245,158,11,0.2), 0 0 4px rgba(245,158,11,0.1)')
								: 'none',
						}}
						title={currentStreak > 0 ? `${currentStreak} day streak!` : 'No active streak'}
					>
						<FiZap
							className="w-4 h-4 transition-all duration-300"
							style={{
								color: currentStreak > 0 ? '#F59E0B' : (isDark ? '#6B7280' : '#9CA3AF'),
								filter: currentStreak > 0 ? 'drop-shadow(0 0 4px rgba(245,158,11,0.5))' : 'none',
							}}
						/>
						<span
							className="text-xs font-bold leading-none"
							style={{
								color: currentStreak > 0 ? '#F59E0B' : (isDark ? '#6B7280' : '#9CA3AF'),
							}}
						>
							{currentStreak}
						</span>
					</button>

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
