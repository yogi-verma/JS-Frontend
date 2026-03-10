import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import { Link } from "react-router-dom";

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer className={`mt-6`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          @DevCrux all right reserved
        </p>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Made with 💙 by
          <Link to="/dashboard/about-developer"> Yogesh Verma</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
