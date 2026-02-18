import { createContext, useContext, useState, useCallback } from 'react';
import { useTheme } from '../WhiteDarkMode/useTheme';
import colors from '../color';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import './Notification.css';

// Create Notification Context
const NotificationContext = createContext();

// Custom hook to use notifications
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, []);

    const addNotification = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        const notification = { id, message, type, duration };

        setNotifications((prev) => [...prev, notification]);

        // Auto-dismiss after duration
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }

        return id;
    }, [removeNotification]);

    const showSuccess = useCallback((message, duration) => {
        return addNotification(message, 'success', duration);
    }, [addNotification]);

    const showError = useCallback((message, duration) => {
        return addNotification(message, 'error', duration);
    }, [addNotification]);

    const showWarning = useCallback((message, duration) => {
        return addNotification(message, 'warning', duration);
    }, [addNotification]);

    const showInfo = useCallback((message, duration) => {
        return addNotification(message, 'info', duration);
    }, [addNotification]);

    const value = {
        notifications,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationContainer notifications={notifications} onClose={removeNotification} />
        </NotificationContext.Provider>
    );
};

// Notification Container Component
const NotificationContainer = ({ notifications, onClose }) => {
    return (
        <div 
            className="fixed top-4 right-4 flex flex-col gap-3 pointer-events-none max-w-md"
            style={{ zIndex: 9999 }}
        >
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClose={onClose}
                />
            ))}
        </div>
    );
};

// Individual Notification Item Component
const NotificationItem = ({ notification, onClose }) => {
    const { isDark } = useTheme();
    const { id, message, type } = notification;

    const getTypeConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: FiCheckCircle,
                    color: isDark ? '#10B981' : '#059669',
                    bgColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                    borderColor: isDark ? '#10B981' : '#059669'
                };
            case 'error':
                return {
                    icon: FiXCircle,
                    color: isDark ? '#EF4444' : '#DC2626',
                    bgColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
                    borderColor: isDark ? '#EF4444' : '#DC2626'
                };
            case 'warning':
                return {
                    icon: FiAlertCircle,
                    color: isDark ? '#F59E0B' : '#D97706',
                    bgColor: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
                    borderColor: isDark ? '#F59E0B' : '#D97706'
                };
            case 'info':
            default:
                return {
                    icon: FiInfo,
                    color: isDark ? colors.blueLight : colors.blueMid,
                    bgColor: isDark ? 'rgba(96, 165, 250, 0.15)' : 'rgba(96, 165, 250, 0.1)',
                    borderColor: isDark ? colors.blueLight : colors.blueMid
                };
        }
    };

    const config = getTypeConfig();
    const IconComponent = config.icon;

    return (
        <div
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg backdrop-blur-sm animate-slideInRight min-w-[320px] max-w-md"
            style={{
                background: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                border: `1px solid ${config.borderColor}`,
                borderLeftWidth: '4px'
            }}
        >
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
                <IconComponent className="w-5 h-5" style={{ color: config.color }} />
            </div>

            {/* Message */}
            <div className="flex-1 min-w-0">
                <p
                    className={`text-sm leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
                    style={{ wordBreak: 'break-word' }}
                >
                    {message}
                </p>
            </div>

            {/* Close Button */}
            <button
                onClick={() => onClose(id)}
                className={`shrink-0 p-1 rounded transition-colors ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                aria-label="Close notification"
            >
                <FiX className="w-4 h-4" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }} />
            </button>
        </div>
    );
};

export default NotificationProvider;
