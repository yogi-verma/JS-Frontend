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
            <div className={`flex justify-center items-center py-12 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
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
                <div className="text-center mb-12">
                    <h2 className={`text-4xl font-bold mb-4 ${colors.blueTextGradient}`}>
                        Available Modules
                    </h2>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Explore our comprehensive learning modules
                    </p>
                </div>

                {/* Modules Grid */}
                {modules.length === 0 ? (
                    <div className="text-center py-12">
                        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            No modules available at the moment.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.map((module, index) => (
                            <div
                                key={module.id || index}
                                className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
                                style={{
                                    background: isDark 
                                        ? `linear-gradient(135deg, #1F2937, #111827)`
                                        : `linear-gradient(135deg, ${colors.blueLight}10, ${colors.blueMid}10)`,
                                    border: `1px solid ${isDark ? '#374151' : colors.blueLighter || '#E0E7FF'}`
                                }}
                            >
                                <div className="p-6">
                                    {/* Module Icon */}
                                    {/* <div 
                                        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.blueLight}, ${colors.blueMid})`
                                        }}
                                    >
                                        <span>
                                            {module.icon || (index + 1)}
                                        </span>
                                    </div> */}

                                    {/* Module Title */}
                                    <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                                        {module.title || module.name || `Module ${index + 1}`}
                                    </h3>

                                    {/* Module Description */}
                                    <p className={`mb-4 line-clamp-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {module.description || 'No description available.'}
                                    </p>

                                    {/* Module Tags */}
                                    {module.tags && module.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {module.tags.slice(0, 3).map((tag, tagIndex) => (
                                                <span 
                                                    key={tagIndex}
                                                    className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {module.tags.length > 3 && (
                                                <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                                    +{module.tags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Module Metadata */}
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                module.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                                module.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                                module.difficulty === 'advanced' ? 'bg-red-100 text-red-700' :
                                                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {module.difficulty || 'beginner'}
                                            </span>
                                            <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                                                {module.estimatedDuration ? `${module.estimatedDuration}h` : 'Self-paced'}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/lessons/module/${module._id}`)}
                                            className="px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-md"
                                            style={{
                                                background: `linear-gradient(135deg, ${colors.blueLight}, ${colors.blueMid})`
                                            }}
                                        >
                                            Start
                                        </button>
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