import colors from '../color';
import './Loader.css';

const Loader = () => {
	return (
		<div className="flex items-center justify-center h-screen">
			<div 
				className="loader-spinner"
				style={{
					borderTopColor: colors.blueLight,
					borderRightColor: colors.blueMid,
					borderBottomColor: colors.blueDark,
					borderLeftColor: colors.blueLight
				}}
			/>
		</div>
	);
};

export default Loader;
