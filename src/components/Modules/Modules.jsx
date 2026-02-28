import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import Loader from "../../utils/Loader/Loader";
import colors from "../../utils/color";
import { getModules } from "../../utils/BackendCalls/authService";

const Modules = () => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isDark } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await getModules();
                console.log('API Response:', response); // Debug log
                
                // Extract modules array from the response
                let modulesArray = [];
                if (response && response.data && Array.isArray(response.data)) {
                    modulesArray = response.data;
                } else if (Array.isArray(response)) {
                    modulesArray = response;
                }
                
                setModules(modulesArray);
            } catch (err) {
                console.error('Error fetching modules:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, []);

    if (loading) {
        return (
            <div className={`flex justify-center items-center min-h-[60vh] ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`py-12 px-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="max-w-4xl mx-auto">
                    <div 
                        className="rounded-lg p-6 border border-red-200 bg-red-50"
                        style={{
                            background: isDark ? '#1F2937' : '#FEF2F2',
                            borderColor: isDark ? '#EF4444' : '#FCA5A5'
                        }}
                    >
                        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                            Error Loading Modules
                        </h3>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`py-6 px-6`}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-5">
                    <h2 className={`text-3xl font-bold mb-2 ${colors.blueTextGradient}`}>
                        Available Modules
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Explore our comprehensive learning paths
                    </p>
                </div>

                {/* Modules Grid */}
                {modules.length === 0 ? (
                    <div className={`text-center py-12 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                        <p className={`text-base font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            No modules available at the moment.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {modules.map((module, index) => (
                            <div
                                key={module.id || index}
                                onClick={() => navigate(`/lessons/module/${module._id}`)}
                                className={`group rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                                    isDark 
                                        ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                                        : 'bg-white border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="p-4">
                                    {/* Module Title */}
                                    <h3 className={`text-base font-semibold mb-2 ${
                                        isDark ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'
                                    } transition-colors`}>
                                        {module.title || module.name || `Module ${index + 1}`}
                                    </h3>

                                    {/* Module Description */}
                                    <p className={`mb-3 line-clamp-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {module.description || 'No description available.'}
                                    </p>

                                    {/* Module Tags */}
                                    {module.tags && module.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {module.tags.slice(0, 3).map((tag, tagIndex) => (
                                                <span 
                                                    key={tagIndex}
                                                    className={`px-2 py-0.5 text-xs rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {module.tags.length > 3 && (
                                                <span className={`px-2 py-0.5 text-xs rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                                    +{module.tags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Module Metadata */}
                                    <div className={`flex items-center justify-between text-xs pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded font-medium capitalize ${
                                                module.difficulty === 'beginner' ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700' :
                                                module.difficulty === 'intermediate' ? isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700' :
                                                module.difficulty === 'advanced' ? isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700' :
                                                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {module.difficulty || 'beginner'}
                                            </span>
                                            <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                                                {module.estimatedDuration ? `${module.estimatedDuration}h` : 'Self-paced'}
                                            </span>
                                        </div>
                                        <svg className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Additional Stats */}
                {/* {modules.length > 0 && (
                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center gap-6">
                            <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                    {modules.length}
                                </div>
                                <div className="text-sm">Total Modules</div>
                            </div>
                        </div>
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default Modules;