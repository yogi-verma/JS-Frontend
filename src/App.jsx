import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './utils/WhiteDarkMode/ThemeContext';
import { UserProvider } from './utils/UserContext/UserContext';
import { NotificationProvider } from './utils/Notification';
import ProtectedRoute from './utils/ProtectedRoute/ProtectedRoute';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import JavascriptLessons from './components/Lessons/JavascriptLessons/JavascriptLessons';
import JavascriptLessonsByName from './components/Lessons/JavascriptLessons/JavascriptLessonsByName/JavascriptLessonsByName';
import JavascriptCompiler from './utils/JavascriptCompiler/JavascriptCompiler';
import UserProfile from './components/UserProfile/UserProfile';
import JavascriptInterviewQuestions from './components/JavascriptInterviewQuestions/JavascriptInterviewQuestions';
import FrontendQuestionBundleButton from './components/FrontendQuestionsBundle/FrontendQuestionBundleButton';
import FrontendQuestionBundle from './components/FrontendQuestionsBundle/FrontendQuestionBundle';
import JavascriptMachineCoding from './components/JavascriptMachineCoding/JavascriptMachineCoding';
import CodingWorkspace from './components/JavascriptMachineCoding/CodingWorkspace';
import OutputBased from './components/OutputBased/OutputBased';
import NotFound from './components/NotFound/NotFound';

function App() {
    return (
        <ThemeProvider>
            <NotificationProvider>
                <UserProvider>
                    <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route 
                            path="/dashboard" 
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/lessons/module/:moduleId" 
                            element={
                                <ProtectedRoute>
                                    <JavascriptLessons />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/lesson/:lessonId" 
                            element={
                                <ProtectedRoute>
                                    <JavascriptLessonsByName />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/dashboard/compiler" 
                            element={
                                <ProtectedRoute>
                                    <JavascriptCompiler />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/dashboard/profile" 
                            element={
                                <ProtectedRoute>
                                    <UserProfile />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/dashboard/interview-questions" 
                            element={
                                <ProtectedRoute>
                                    <JavascriptInterviewQuestions />
                                </ProtectedRoute>
                            } 
                        />
                        
                        <Route 
                            path="/dashboard/frontend-interview-questions" 
                            element={
                                <ProtectedRoute>
                                    <FrontendQuestionBundle />
                                </ProtectedRoute>
                            } 
                        />

                        <Route 
                            path="/dashboard/output-based-questions" 
                            element={
                                <ProtectedRoute>
                                    <OutputBased />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/dashboard/coding-questions" 
                            element={
                                <ProtectedRoute>
                                    <JavascriptMachineCoding />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/dashboard/coding-questions/:questionId" 
                            element={
                                <ProtectedRoute>
                                    <CodingWorkspace />
                                </ProtectedRoute>
                            } 
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
                </UserProvider>
            </NotificationProvider>
        </ThemeProvider>
    );
}

export default App;
