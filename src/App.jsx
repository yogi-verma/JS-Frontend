import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './utils/WhiteDarkMode/ThemeContext';
import ProtectedRoute from './utils/ProtectedRoute/ProtectedRoute';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import JavascriptLessons from './components/Lessons/JavascriptLessons/JavascriptLessons';
import JavascriptLessonsByName from './components/Lessons/JavascriptLessons/JavascriptLessonsByName/JavascriptLessonsByName';

function App() {
    return (
        <ThemeProvider>
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
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
