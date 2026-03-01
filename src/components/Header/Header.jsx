import { useNavigate } from 'react-router-dom';
import colors from '../../utils/color';
import { useTheme } from '../../utils/WhiteDarkMode/useTheme';
import { useUser } from '../../utils/UserContext/UserContext';
import ThemeToggle from '../../utils/WhiteDarkMode/ThemeToggle';
import Hamburger from '../../utils/HamBurger/Hamburger';
import { initializeGoogleLogin } from '../../utils/BackendCalls/authService';
import logo from "../../assets/logo.png";

const Header = () => {
	const { isDark } = useTheme();
	const { user } = useUser();
	const navigate = useNavigate();

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
			className={`sticky top-0 z-50 w-full max-w-full overflow-hidden text-gray-800 border-b shadow-sm ${isDark ? 'text-gray-100' : ''}`}
		>
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
				<div className="flex items-center gap-2">
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

				{/* Hamburger — visible on small screens; opens drawer with user photo + theme */}
				<div className="ml-auto">
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
