import colors from '../../utils/color';

const Footer = () => {
	const gradient = `linear-gradient(90deg, ${colors.blueMid}, ${colors.blueDark})`;

	return (
		<footer style={{ background: gradient }} className="text-white mt-12">
			<div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
				<div>
					<h3 className="font-semibold">MyApp</h3>
					<p className="text-sm text-white/90">© {new Date().getFullYear()} MyApp. All rights reserved.</p>
				</div>

				<div className="flex gap-4">
					<a href="#" className="text-white/90 hover:underline">Privacy</a>
					<a href="#" className="text-white/90 hover:underline">Terms</a>
					<a href="#" className="text-white/90 hover:underline">Contact</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
