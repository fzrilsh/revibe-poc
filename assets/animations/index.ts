// Export all animation variants
export * from './variants';
export * from './transitions';
export * from './gestures';

// Utility function to combine animations
export const combineAnimations = (...animations: Record<string, unknown>[]) => {
    return animations.reduce((acc, curr) => ({
        ...acc,
        ...curr
    }), {});
};

// Utility function to add delay to animation
export const withDelay = (animation: Record<string, unknown>, delay: number) => {
    return {
        ...animation,
        transition: {
            ...(animation.transition as Record<string, unknown>),
            delay
        }
    };
};

// Utility function to change duration
export const withDuration = (animation: Record<string, unknown>, duration: number) => {
    return {
        ...animation,
        transition: {
            ...(animation.transition as Record<string, unknown>),
            duration
        }
    };
};
