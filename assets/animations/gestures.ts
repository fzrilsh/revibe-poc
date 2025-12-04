// Hover animations
export const hoverScale = {
    whileHover: { scale: 1.05 },
    transition: { duration: 0.2 }
};

export const hoverScaleSmall = {
    whileHover: { scale: 1.02 },
    transition: { duration: 0.2 }
};

export const hoverScaleLarge = {
    whileHover: { scale: 1.1 },
    transition: { duration: 0.2 }
};

export const hoverLift = {
    whileHover: { y: -5, scale: 1.02 },
    transition: { duration: 0.2 }
};

export const hoverRotate = {
    whileHover: { rotate: 5 },
    transition: { duration: 0.2 }
};

export const hoverBrightness = {
    whileHover: { filter: "brightness(1.1)" },
    transition: { duration: 0.2 }
};

// Tap animations
export const tapScale = {
    whileTap: { scale: 0.95 },
    transition: { duration: 0.1 }
};

export const tapScaleSmall = {
    whileTap: { scale: 0.98 },
    transition: { duration: 0.1 }
};

export const tapScaleLarge = {
    whileTap: { scale: 0.9 },
    transition: { duration: 0.1 }
};

// Combined hover and tap
export const button = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
};

export const buttonLarge = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2 }
};

export const buttonWithShadow = {
    whileHover: { 
        scale: 1.02,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
    },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
};

// Focus animations
export const focusRing = {
    whileFocus: { 
        boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.5)" 
    },
    transition: { duration: 0.2 }
};

// Drag animations
export const draggable = {
    drag: true,
    dragConstraints: { top: 0, left: 0, right: 0, bottom: 0 },
    dragElastic: 0.2
};

export const draggableX = {
    drag: "x" as const,
    dragConstraints: { left: -100, right: 100 },
    dragElastic: 0.2
};

export const draggableY = {
    drag: "y" as const,
    dragConstraints: { top: -100, bottom: 100 },
    dragElastic: 0.2
};
