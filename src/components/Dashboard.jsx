import { useTheme } from "../utils/WhiteDarkMode/useTheme";
import { useUser } from "../utils/UserContext/UserContext";
import Header from "./Header/Header";
import Section from "./Section/Section";
import Reason from "./Reason/Reason";
import Modules from "./Modules/Modules";
import Loader from "../utils/Loader/Loader";
import Footer from "./Footer/Footer";
import JavascriptCompilerButton from "../utils/JavascriptCompiler/JavascriptCompilerButton";
import JavascriptInterviewQuestionsButton from "./JavascriptInterviewQuestions/JavascriptInterviewQuestionsButton";
import FrontendQuestionBundleButton from "./FrontendQuestionsBundle/FrontendQuestionBundleButton";

const Dashboard = () => {
    const { loading } = useUser();
    const { isDark } = useTheme();

    if (loading) {
        return (
            <div className={`h-screen flex justify-center items-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                <Loader />
            </div>
        );
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

            <Footer />

        </div>
    );
};

export default Dashboard;
