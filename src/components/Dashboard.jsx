import { useTheme } from "../utils/WhiteDarkMode/useTheme";
import ScrollToTopButton from "./ScrollToTop/ScrollToTopButton";
import { useUser } from "../utils/UserContext/UserContext";
import Header from "./Header/Header";
import AnimatedBackground from "./AnimatedBackground/AnimatedBackground";
import Section from "./Section/Section";
import Reason from "./Reason/Reason";
import Modules from "./Modules/Modules";
import SkeletonLoader from "../utils/SkeletonLoader/SkeletonLoader";
import Footer from "./Footer/Footer";
import JavascriptCompilerButton from "../utils/JavascriptCompiler/JavascriptCompilerButton";
import LearningCards from "./LearningCards/LearningCards";
import DailyQuiz from "./DailyQuiz/DailyQuiz";
import DailyQuizStickyIcon from "./DailyQuiz/DailyQuizStickyIcon";
import FeatureLaunchBanner from "./FeatureLaunchBanner/FeatureLaunchBanner";
import OutputBasedPromoStrip from "./FeatureLaunchBanner/OutputBasedPromoStrip";

const Dashboard = () => {
    const { loading, showDailyQuiz } = useUser();
    const { isDark } = useTheme();

    if (loading) {
        return <SkeletonLoader variant="dashboard" />;
    }

    return (
        <div
            className={`relative min-h-screen ${isDark ? 'bg-gray-900 text-gray-100' : 'text-gray-800'}`}
            style={!isDark ? { background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 45%, #EDE9FE 100%)' } : undefined}
        >
            <AnimatedBackground isDark={isDark} />
            <div className="relative z-10">
            <Header />

            {/* Persistent promo strip — Output-Based Questions */}
            <OutputBasedPromoStrip />
            
            <Section />

            <Modules />

            <LearningCards />

            <JavascriptCompilerButton />

            <Reason />

            <Footer />

            {/* Sticky quiz icon — always visible */}
            <DailyQuizStickyIcon />

            {/* Daily Quiz popup — rendered on top of everything */}
            {showDailyQuiz && <DailyQuiz />}

            {/* Feature launch announcement — Output-Based Questions */}
            <FeatureLaunchBanner />

            {/* Scroll to top button — visible on scroll */}
            <ScrollToTopButton />
            </div>
        </div>
    );
};

export default Dashboard;
