import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './utils/WhiteDarkMode/ThemeContext';
import { UserProvider } from './utils/UserContext/UserContext';
import ProtectedRoute from './utils/ProtectedRoute/ProtectedRoute';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import JavascriptLessons from './components/Lessons/JavascriptLessons/JavascriptLessons';
import JavascriptLessonsByName from './components/Lessons/JavascriptLessons/JavascriptLessonsByName/JavascriptLessonsByName';
import JavascriptCompiler from './utils/JavascriptCompiler/JavascriptCompiler';

function App() {
    return (
        <ThemeProvider>
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
                    </Routes>
                </Router>
            </UserProvider>
        </ThemeProvider>
    );
}

export default App;
