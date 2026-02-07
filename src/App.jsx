import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './utils/WhiteDarkMode/ThemeContext';
import Home from './components/Home';
import Dashboard from './components/Dashboard';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
