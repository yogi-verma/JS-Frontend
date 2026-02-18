import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useTheme } from '../WhiteDarkMode/useTheme';
import ThemeToggle from '../WhiteDarkMode/ThemeToggle';
import colors from '../color';
import { logout } from '../BackendCalls/authService';

const HamburgerIcon = ({ isOpen, onClick, isDark }) => (
	<button
		type="button"
		onClick={onClick}
		className="group p-2 rounded-lg transition-all duration-300 hover:cursor-pointer hover:scale-105"
		aria-label={isOpen ? 'Close menu' : 'Open menu'}
		aria-expanded={isOpen}
	>
		<span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
		<GiHamburgerMenu
			className="w-6 h-6 transition-colors duration-300"
			style={{ color: isDark ? colors.textLight : colors.textDark }}
			aria-hidden
		/>
	</button>
);

const Hamburger = ({ user, getInitials, onLoginClick }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const { isDark } = useTheme();
	const navigate = useNavigate();

	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape') {
				if (showLogoutModal) setShowLogoutModal(false);
				else setIsOpen(false);
			}
		};
		if (isOpen || showLogoutModal) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}
		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = '';
		};
	}, [isOpen, showLogoutModal]);

	return (
		<>
			<HamburgerIcon isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} isDark={isDark} />

			{/* Backdrop */}
			<div
				className={`fixed inset-0 z-40 transition-opacity duration-300 ${
					isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				}`}
				aria-hidden="true"
				onClick={() => setIsOpen(false)}
				style={{ background: 'rgba(0,0,0,0.4)' }}
			/>

			{/* Right drawer */}
			<aside
				className={`fixed top-0 right-0 z-50 h-full w-[280px] max-w-[85vw] shadow-xl transition-transform duration-300 ease-out flex flex-col ${
					isOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
				style={{
					background: isDark ? '#1F2937' : colors.white,
					borderLeft: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`
				}}
				aria-label="Menu panel"
			>
				<div className="flex items-center justify-between p-4.5 border-b shrink-0" style={{ borderColor: isDark ? '#374151' : '#E5E7EB' }}>
					<span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Menu</span>
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						className={`p-2 rounded-lg transition-colors hover:opacity-80 focus:outline-none ${isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-800'} hover:cursor-pointer hover:scale-105 transition-all duration-300`}
						aria-label="Close menu"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div className="flex-1 flex flex-col gap-4 p-4 overflow-auto">
					{user ? (
						<div 
							className="flex items-center gap-3 p-3 rounded-xl hover:cursor-pointer hover:opacity-80 transition-opacity" 
							style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
							onClick={() => {
								navigate('/dashboard/profile');
								setIsOpen(false);
							}}
						>
							{user.photo ? (
								<img
									src={user.photo}
									alt="Profile"
									title={user.displayName}
									className={`w-9 h-9 rounded-full border-2 object-cover ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
								/>
							) : (
								<div
									className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white border-2"
									style={{
										background: colors.blueLight,
										borderColor: isDark ? '#374151' : '#E0E7FF'
									}}
									title={user.displayName}
								>
									{getInitials(user.displayName)}
								</div>
							)}
							<div className="min-w-0">
								<p className={`text-sm font-bold truncate ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{user.displayName}</p>
								<p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
							</div>
						</div>
					) : (
						onLoginClick && (
							<button
								onClick={() => {
									onLoginClick();
									setIsOpen(false);
								}}
								className={`w-full py-2.5 px-4 hover:cursor-pointer rounded-lg font-medium transition ${isDark ? 'bg-blue-900 text-blue-100 hover:bg-blue-800' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
							>
								Sign In / Log In
							</button>
						)
					)}

					<div className="flex items-center justify-between p-3 rounded-xl" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
						<span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Theme</span>
						<ThemeToggle />
					</div>
				</div>

				{user && (
					<div className="shrink-0 p-4 border-t" style={{ borderColor: isDark ? '#374151' : '#E5E7EB' }}>
						<button
							type="button"
							onClick={() => {
								setIsOpen(false);
								setShowLogoutModal(true);
							}}
							className={`w-full py-2.5 px-4 rounded-lg font-medium transition hover:cursor-pointer ${isDark ? 'bg-red-900 text-red-100 hover:bg-red-800' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
						>
							Logout
						</button>
					</div>
				)}
			</aside>

			{/* Logout confirmation modal */}
			<div
				className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-200 ${
					showLogoutModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
				}`}
				aria-hidden={!showLogoutModal}
			>
				<div
					className="absolute inset-0 backdrop-blur-md"
					style={{
						background: `${colors.blueDark}E6`
					}}
					onClick={() => setShowLogoutModal(false)}
					aria-hidden="true"
				/>
				<div
					role="dialog"
					aria-modal="true"
					aria-labelledby="logout-modal-title"
					className="relative w-full max-w-sm rounded-xl shadow-xl p-6 bg-white border border-gray-200"
					onClick={(e) => e.stopPropagation()}
				>
					<p id="logout-modal-title" className="text-center font-medium text-gray-800">
						Do you really want to logout?
					</p>
					<div className="mt-6 flex gap-3 justify-center">
						<button
							type="button"
							onClick={() => {
								setShowLogoutModal(false);
								logout();
							}}
							className={`px-5 py-2.5 rounded-lg font-medium hover:cursor-pointer transition ${isDark ? 'bg-red-900 text-red-100 hover:bg-red-800' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
						>
							Yes
						</button>
						<button
							type="button"
							onClick={() => setShowLogoutModal(false)}
							className={`px-5 py-2.5 rounded-lg font-medium transition hover:cursor-pointer ${isDark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
						>
							No
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Hamburger;
