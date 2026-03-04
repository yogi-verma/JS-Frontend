import { useTheme } from "../utils/WhiteDarkMode/useTheme";
import { useUser } from "../utils/UserContext/UserContext";
import Header from "./Header/Header";
import Section from "./Section/Section";
import Reason from "./Reason/Reason";
import Modules from "./Modules/Modules";
import SkeletonLoader from "../utils/SkeletonLoader/SkeletonLoader";
import Footer from "./Footer/Footer";
import JavascriptCompilerButton from "../utils/JavascriptCompiler/JavascriptCompilerButton";
import LearningCards from "./LearningCards/LearningCards";
import DailyQuiz from "./DailyQuiz/DailyQuiz";

const Dashboard = () => {
    const { loading, showDailyQuiz } = useUser();
    const { isDark } = useTheme();

    if (loading) {
        return <SkeletonLoader variant="dashboard" />;
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
            <Header />
            
            <Section />

            <Modules />

            <LearningCards />

            <JavascriptCompilerButton />

            <Reason />

            <Footer />

            {/* Daily Quiz popup — rendered on top of everything */}
            {showDailyQuiz && <DailyQuiz />}
        </div>
    );
};

export default Dashboard;
