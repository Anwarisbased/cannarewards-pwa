// A simple utility to trigger haptic feedback if the browser supports it.

const canVibrate = () => window.navigator && window.navigator.vibrate;

/**
 * Triggers a generic haptic feedback.
 * @param {number} duration The duration of the vibration in milliseconds.
 */
export const triggerHapticFeedback = (duration = 100) => {
    if (canVibrate()) {
        window.navigator.vibrate(duration);
    }
};

/**
 * Triggers a light impact haptic feedback.
 */
export const lightImpact = () => {
    triggerHapticFeedback(50);
};

/**
 * Triggers a medium impact haptic feedback.
 */
export const mediumImpact = () => {
    triggerHapticFeedback(100);
};

/**
 * Triggers a heavy impact haptic feedback.
 */
export const heavyImpact = () => {
    triggerHapticFeedback(200);
};

/**
 * Triggers a success haptic feedback (e.g., short-long).
 */
export const successHaptic = () => {
    if (canVibrate()) {
        window.navigator.vibrate([50, 50, 150]); // short, pause, long
    }
};

/**
 * Triggers a warning haptic feedback (e.g., long-short).
 */
export const warningHaptic = () => {
    if (canVibrate()) {
        window.navigator.vibrate([150, 50, 50]); // long, pause, short
    }
};

/**
 * Triggers an error haptic feedback (e.g., three short pulses).
 */
export const errorHaptic = () => {
    if (canVibrate()) {
        window.navigator.vibrate([100, 50, 100, 50, 100]); // short, pause, short, pause, short
    }
};