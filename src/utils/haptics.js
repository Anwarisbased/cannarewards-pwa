// A simple utility to trigger haptic feedback if the browser supports it.
export const triggerHapticFeedback = () => {
    // Check if the Vibration API is supported by the browser and enabled on the device.
    if (window.navigator && window.navigator.vibrate) {
        // A short, sharp vibration is good for confirmation.
        // The value is in milliseconds.
        window.navigator.vibrate(100);
    }
};