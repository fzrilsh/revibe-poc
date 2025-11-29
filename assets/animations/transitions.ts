// Duration presets
export const DURATION = {
    fast: 0.2,
    normal: 0.3,
    medium: 0.5,
    slow: 0.8,
    verySlow: 1.2
};

// Easing presets
export const EASING = {
    linear: [0, 0, 1, 1],
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    bouncy: [0.68, -0.55, 0.265, 1.55],
    smooth: [0.25, 0.46, 0.45, 0.94]
};

// Spring presets
export const SPRING = {
    gentle: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
    },
    wobbly: {
        type: "spring" as const,
        stiffness: 180,
        damping: 12
    },
    stiff: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20
    },
    slow: {
        type: "spring" as const,
        stiffness: 80,
        damping: 10
    },
    bouncy: {
        type: "spring" as const,
        stiffness: 300,
        damping: 10
    }
};

// Delay presets
export const DELAY = {
    instant: 0,
    short: 0.1,
    normal: 0.2,
    medium: 0.3,
    long: 0.5
};

// Page transition variants
export const pageTransition = {
    type: "tween" as const,
    ease: EASING.easeInOut,
    duration: DURATION.normal
};

export const springTransition = {
    ...SPRING.gentle,
    duration: DURATION.medium
};
