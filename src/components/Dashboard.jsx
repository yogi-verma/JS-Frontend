import { useTheme } from "../utils/WhiteDarkMode/useTheme";
import { useUser } from "../utils/UserContext/UserContext";
import Header from "./Header/Header";
import Section from "./Section/Section";
import Reason from "./Reason/Reason";
import Modules from "./Modules/Modules";
import SkeletonLoader from "../utils/SkeletonLoader/SkeletonLoader";
import Footer from "./Footer/Footer";
import JavascriptCompilerButton from "../utils/JavascriptCompiler/JavascriptCompilerButton";
import JavascriptInterviewQuestionsButton from "./JavascriptInterviewQuestions/JavascriptInterviewQuestionsButton";
import FrontendQuestionBundleButton from "./FrontendQuestionsBundle/FrontendQuestionBundleButton";
import JavascriptMachineCodingButton from "./JavascriptMachineCoding/JavascriptMachineCodingButton";

const Dashboard = () => {
    const { loading } = useUser();
    const { isDark } = useTheme();

    if (loading) {
        return <SkeletonLoader variant="dashboard" />;
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
            <Header />
            
            <Section />

            <JavascriptInterviewQuestionsButton />

            
            <Modules />


            <JavascriptCompilerButton />

            <Reason />

            <FrontendQuestionBundleButton />

            <JavascriptMachineCodingButton />

            <Footer />

        </div>
    );
};

export default Dashboard;
