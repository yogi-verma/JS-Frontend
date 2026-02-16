# Notification Toast System

A centralized toast notification system for the application with support for multiple notification types and dark/light theme.

## Features

- ✅ Multiple notification types (success, error, warning, info)
- ✅ Auto-dismiss with configurable duration
- ✅ Manual close button
- ✅ Dark/Light theme support
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Stack multiple notifications

## Setup

### 1. Wrap your app with NotificationProvider

In your `main.jsx` or `App.jsx`:

```jsx
import { NotificationProvider } from './utils/Notification';

function App() {
  return (
    <NotificationProvider>
      {/* Your app components */}
    </NotificationProvider>
  );
}
```

## Usage

### Import the hook

```jsx
import { useNotification } from '../../utils/Notification';
```

### In your component

```jsx
const MyComponent = () => {
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  const handleSuccess = () => {
    showSuccess('Operation completed successfully!');
  };

  const handleError = () => {
    showError('Something went wrong!');
  };

  const handleWarning = () => {
    showWarning('Please be careful!');
  };

  const handleInfo = () => {
    showInfo('Here is some information.');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleWarning}>Show Warning</button>
      <button onClick={handleInfo}>Show Info</button>
    </div>
  );
};
```

## API

### Methods

- `showSuccess(message, duration)` - Show success notification (green)
- `showError(message, duration)` - Show error notification (red)
- `showWarning(message, duration)` - Show warning notification (orange)
- `showInfo(message, duration)` - Show info notification (blue)
- `addNotification(message, type, duration)` - Generic method
- `removeNotification(id)` - Manually remove a notification

### Parameters

- `message` (string) - The notification message to display
- `duration` (number, optional) - Auto-dismiss duration in milliseconds (default: 4000ms)
  - Set to `0` for no auto-dismiss
- `type` (string) - Notification type: 'success' | 'error' | 'warning' | 'info'

### Return Value

All notification methods return a notification `id` that can be used to manually remove it:

```jsx
const notificationId = showSuccess('Processing...');
// Later...
removeNotification(notificationId);
```

## Examples

### Basic Usage

```jsx
showSuccess('User profile updated!');
showError('Failed to save changes');
```

### Custom Duration

```jsx
showSuccess('Quick message', 2000); // 2 seconds
showInfo('Long message', 10000); // 10 seconds
showWarning('No auto-dismiss', 0); // Won't auto-dismiss
```

### With Manual Control

```jsx
const handleAsyncOperation = async () => {
  const loadingId = showInfo('Processing...', 0);
  
  try {
    await someAsyncOperation();
    removeNotification(loadingId);
    showSuccess('Operation completed!');
  } catch (error) {
    removeNotification(loadingId);
    showError('Operation failed!');
  }
};
```

## Styling

The notification system automatically adapts to your app's theme (dark/light mode) and uses the colors defined in `utils/color.js`.

### Position

Notifications appear in the top-right corner by default. To change position, modify the `NotificationContainer` component in `Notification.jsx`:

```jsx
// Current: top-right
<div className="fixed top-4 right-4 z-[100]">

// Top-left
<div className="fixed top-4 left-4 z-[100]">

// Bottom-right
<div className="fixed bottom-4 right-4 z-[100]">
```
