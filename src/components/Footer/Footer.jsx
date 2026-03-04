import colors from '../../utils/color';
import { useTheme } from '../../utils/WhiteDarkMode/useTheme';

const Footer = () => {
	const { isDark } = useTheme();
	const background = isDark ? '#1F2937' : colors.white;
	const borderColor = isDark ? '#374151' : '#E0E7FF';

	return (
		<footer
			style={{ background, borderColor }}
			className={`mt-12 border-t ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
				<p className="text-sm">@DevCrux all right reserved</p>
				<p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
					Made with 💙 by Yogesh Verma
				</p>
			</div>
		</footer>
	);
};

export default Footer;
