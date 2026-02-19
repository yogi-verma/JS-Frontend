import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiMenuAlt3, HiX, HiUser, HiLogout, HiMoon, HiSun } from 'react-icons/hi';
import { MdLogout, MdClose } from 'react-icons/md';
import { useTheme } from '../WhiteDarkMode/useTheme';
import ThemeToggle from '../WhiteDarkMode/ThemeToggle';
import colors from '../color';
import { logout } from '../BackendCalls/authService';

const HamburgerIcon = ({ isOpen, onClick, isDark }) => (
	<button
		type="button"
		onClick={onClick}
		className="group relative p-2.5 rounded-xl transition-all duration-300 hover:scale-105"
		style={{
			background: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.05)',
			border: isDark ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(59, 130, 246, 0.15)',
		}}
		aria-label={isOpen ? 'Close menu' : 'Open menu'}
		aria-expanded={isOpen}
	>
		<span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
		{isOpen ? (
			<HiX
				className="w-6 h-6 transition-all duration-300"
				style={{ color: isDark ? colors.blueLight : colors.blueMid }}
				aria-hidden
			/>
		) : (
			<HiMenuAlt3
				className="w-6 h-6 transition-all duration-300"
				style={{ color: isDark ? colors.blueLight : colors.blueMid }}
				aria-hidden
			/>
		)}
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
				style={{ 
					background: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)',
					backdropFilter: 'blur(4px)',
				}}
			/>

			{/* Right drawer */}
			<aside
				className={`fixed top-0 right-0 z-50 h-full w-[320px] max-w-[85vw] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
					isOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
				style={{
					background: isDark 
						? 'linear-gradient(180deg, #1F2937 0%, #111827 100%)' 
						: 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)',
					borderLeft: isDark 
						? '1px solid rgba(59, 130, 246, 0.2)' 
						: '1px solid rgba(229, 231, 235, 0.8)',
					boxShadow: isDark
						? '-4px 0 24px rgba(0, 0, 0, 0.5)'
						: '-4px 0 24px rgba(0, 0, 0, 0.1)',
				}}
				aria-label="Menu panel"
			>
				{/* Header */}
				<div 
					className="flex items-center justify-between px-6 py-5 border-b shrink-0" 
					style={{ 
						borderColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(229, 231, 235, 0.8)',
						background: isDark ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)',
					}}
				>
					<span 
						className="text-base font-bold tracking-tight" 
						style={{ color: isDark ? colors.blueLight : colors.blueMid }}
					>
						Menu
					</span>
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						className="p-2 rounded-lg transition-all duration-300 hover:scale-110 focus:outline-none"
						style={{
							background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
							color: isDark ? '#9CA3AF' : '#6B7280',
						}}
						aria-label="Close menu"
					>
						<HiX className="h-5 w-5" />
					</button>
				</div>

				{/* Content */}
				<div className="flex-1 flex flex-col gap-5 p-6 overflow-auto">
					{user ? (
						<div 
							className="group flex items-center gap-4 p-4 rounded-xl hover:cursor-pointer transition-all duration-300" 
							style={{ 
								background: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.05)',
								border: isDark ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(59, 130, 246, 0.15)',
							}}
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
									className="w-12 h-12 rounded-full object-cover ring-2 transition-all duration-300 group-hover:ring-4"
									style={{ 
										ringColor: isDark ? colors.blueLight : colors.blueMid,
									}}
								/>
							) : (
								<div
									className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ring-2 transition-all duration-300 group-hover:ring-4"
									style={{
										background: `linear-gradient(135deg, ${colors.blueLight}, ${colors.blueMid})`,
										ringColor: isDark ? colors.blueLight : colors.blueMid,
									}}
									title={user.displayName}
								>
									{getInitials(user.displayName)}
								</div>
							)}
							<div className="min-w-0 flex-1">
								<p 
									className="text-base font-bold truncate" 
									style={{ color: isDark ? '#F9FAFB' : '#111827' }}
								>
									{user.displayName}
								</p>
								<p 
									className="text-sm truncate" 
									style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
								>
									{user.email}
								</p>
							</div>
							<HiUser 
								className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity"
								style={{ color: isDark ? colors.blueLight : colors.blueMid }}
							/>
						</div>
					) : (
						onLoginClick && (
							<button
								onClick={() => {
									onLoginClick();
									setIsOpen(false);
								}}
								className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
								style={{
									background: `linear-gradient(135deg, ${colors.blueLight}, ${colors.blueMid})`,
									color: '#FFFFFF',
									boxShadow: isDark
										? '0 4px 12px rgba(59, 130, 246, 0.3)'
										: '0 4px 12px rgba(59, 130, 246, 0.25)',
								}}
							>
								Sign In / Log In
							</button>
						)
					)}

					{/* Theme Toggle Section */}
					<div 
						className="flex items-center justify-between p-4 rounded-xl" 
						style={{ 
							background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
							border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
						}}
					>
						<div className="flex items-center gap-3">
							{isDark ? (
								<HiMoon className="w-5 h-5" style={{ color: colors.blueLight }} />
							) : (
								<HiSun className="w-5 h-5" style={{ color: colors.blueMid }} />
							)}
							<span 
								className="text-sm font-semibold" 
								style={{ color: isDark ? '#E5E7EB' : '#374151' }}
							>
								Theme
							</span>
						</div>
						<ThemeToggle />
					</div>
				</div>

				{/* Logout Button */}
				{user && (
					<div 
						className="shrink-0 px-6 py-5 border-t" 
						style={{ 
							borderColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(229, 231, 235, 0.8)',
							background: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
						}}
					>
						<button
							type="button"
							onClick={() => {
								setIsOpen(false);
								setShowLogoutModal(true);
							}}
							className="group w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
							style={{
								background: isDark 
									? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.15))' 
									: 'linear-gradient(135deg, rgba(254, 226, 226, 1), rgba(254, 202, 202, 1))',
								color: isDark ? '#FCA5A5' : '#DC2626',
								border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(239, 68, 68, 0.2)',
							}}
						>
							<MdLogout className="w-5 h-5 transition-transform group-hover:translate-x-[-2px]" />
							Logout
						</button>
					</div>
				)}
			</aside>

			{/* Logout confirmation modal */}
			<div
				className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${
					showLogoutModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
				}`}
				aria-hidden={!showLogoutModal}
			>
				{/* Backdrop */}
				<div
					className="absolute inset-0 backdrop-blur-md"
					style={{
						background: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.5)',
					}}
					onClick={() => setShowLogoutModal(false)}
					aria-hidden="true"
				/>
				
				{/* Modal */}
				<div
					role="dialog"
					aria-modal="true"
					aria-labelledby="logout-modal-title"
					className={`relative w-full max-w-md rounded-2xl shadow-2xl p-8 transform transition-all duration-300 ${
						showLogoutModal ? 'scale-100' : 'scale-95'
					}`}
					style={{
						background: isDark 
							? 'linear-gradient(135deg, #1F2937 0%, #111827 100%)' 
							: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
						border: isDark 
							? '1px solid rgba(59, 130, 246, 0.2)' 
							: '1px solid rgba(229, 231, 235, 0.8)',
					}}
					onClick={(e) => e.stopPropagation()}
				>
					{/* Icon */}
					{/* <div className="flex justify-center mb-6">
						<div 
							className="p-4 rounded-full"
							style={{
								background: isDark 
									? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.15))' 
									: 'linear-gradient(135deg, rgba(254, 226, 226, 1), rgba(254, 202, 202, 1))',
							}}
						>
							<HiLogout 
								className="w-10 h-10" 
								style={{ color: isDark ? '#FCA5A5' : '#DC2626' }}
							/>
						</div>
					</div> */}

					{/* Title */}
					<h3 
						id="logout-modal-title" 
						className="text-center text-2xl font-bold mb-3"
						style={{ color: isDark ? '#F9FAFB' : '#111827' }}
					>
						Confirm Logout
					</h3>
					
					{/* Message */}
					<p 
						className="text-center text-base mb-8"
						style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
					>
						Are you sure you want to logout from your account?
					</p>
					
					{/* Buttons */}
					<div className="flex gap-3 justify-center">
						<button
							type="button"
							onClick={() => {
								setShowLogoutModal(false);
								logout();
							}}
							className="group flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
							style={{
								background: isDark 
									? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))' 
									: 'linear-gradient(135deg, #EF4444, #DC2626)',
								color: isDark ? '#FCA5A5' : '#FFFFFF',
								border: isDark ? '1px solid rgba(239, 68, 68, 0.4)' : 'none',
								boxShadow: isDark 
									? 'none' 
									: '0 4px 12px rgba(239, 68, 68, 0.25)',
							}}
						>
							<MdLogout className="w-5 h-5" />
							Logout
						</button>
						<button
							type="button"
							onClick={() => setShowLogoutModal(false)}
							className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
							style={{
								background: isDark 
									? 'rgba(255, 255, 255, 0.08)' 
									: 'rgba(0, 0, 0, 0.05)',
								color: isDark ? '#E5E7EB' : '#374151',
								border: isDark 
									? '1px solid rgba(255, 255, 255, 0.15)' 
									: '1px solid rgba(0, 0, 0, 0.1)',
							}}
						>
							Cancel
						</button>
					</div>

					{/* Close button */}
					<button
						type="button"
						onClick={() => setShowLogoutModal(false)}
						className="absolute top-4 right-4 p-2 rounded-lg transition-all duration-300 hover:scale-110"
						style={{
							background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
							color: isDark ? '#9CA3AF' : '#6B7280',
						}}
						aria-label="Close modal"
					>
						<MdClose className="w-5 h-5" />
					</button>
				</div>
			</div>
		</>
	);
};

export default Hamburger;
