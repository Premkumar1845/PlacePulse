/**
 * Animation Utilities & Motion Constants
 * Professional motion design system following Material Motion principles
 */

// ============================================
// TIMING & EASING CONSTANTS
// ============================================

// Standard durations (in seconds for Framer Motion)
export const DURATION = {
    instant: 0.1,
    fast: 0.15,
    normal: 0.2,
    medium: 0.3,
    slow: 0.4,
    slower: 0.5,
    page: 0.6,
};

// Professional easing curves
export const EASING = {
    // Standard Material Design curves
    standard: [0.4, 0, 0.2, 1],
    decelerate: [0, 0, 0.2, 1],
    accelerate: [0.4, 0, 1, 1],

    // Custom smooth curves
    smooth: [0.25, 0.1, 0.25, 1],
    smoothOut: [0, 0.55, 0.45, 1],

    // Bounce & spring-like
    bounce: [0.68, -0.55, 0.265, 1.55],
    gentle: [0.4, 0, 0.6, 1],

    // Apple-style curves
    apple: [0.25, 0.1, 0.25, 1],
    appleSpring: [0.5, 1.25, 0.75, 1],
};

// Spring configurations
export const SPRING = {
    // Snappy - for micro-interactions
    snappy: { type: 'spring', stiffness: 400, damping: 30 },

    // Gentle - for larger movements
    gentle: { type: 'spring', stiffness: 200, damping: 25 },

    // Bouncy - for playful interactions
    bouncy: { type: 'spring', stiffness: 300, damping: 20 },

    // Stiff - for quick responses
    stiff: { type: 'spring', stiffness: 500, damping: 35 },

    // Soft - for smooth transitions
    soft: { type: 'spring', stiffness: 150, damping: 20 },
};

// ============================================
// ANIMATION VARIANTS
// ============================================

// Fade animations
export const fadeVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: DURATION.normal, ease: EASING.smooth }
    },
    exit: {
        opacity: 0,
        transition: { duration: DURATION.fast, ease: EASING.accelerate }
    }
};

// Slide up animations (for modals, cards)
export const slideUpVariants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: DURATION.medium,
            ease: EASING.decelerate
        }
    },
    exit: {
        opacity: 0,
        y: 20,
        transition: {
            duration: DURATION.fast,
            ease: EASING.accelerate
        }
    }
};

// Scale animations (for buttons, cards)
export const scaleVariants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: SPRING.gentle
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: DURATION.fast }
    }
};

// Modal/overlay animations
export const modalVariants = {
    overlay: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: DURATION.normal }
        },
        exit: {
            opacity: 0,
            transition: { duration: DURATION.fast, delay: 0.1 }
        }
    },
    content: {
        hidden: {
            opacity: 0,
            scale: 0.95,
            y: 20
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: SPRING.gentle
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 20,
            transition: { duration: DURATION.fast }
        }
    }
};

// Stagger container for lists
export const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        }
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.03,
            staggerDirection: -1,
        }
    }
};

// Stagger item for list children
export const staggerItemVariants = {
    hidden: {
        opacity: 0,
        y: 15,
        scale: 0.98
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: DURATION.medium,
            ease: EASING.decelerate
        }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: DURATION.fast }
    }
};

// Slide in from left (for sidebars)
export const slideInLeftVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: SPRING.gentle
    },
    exit: {
        x: -30,
        opacity: 0,
        transition: { duration: DURATION.fast }
    }
};

// Slide in from right
export const slideInRightVariants = {
    hidden: { x: 30, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: SPRING.gentle
    },
    exit: {
        x: 30,
        opacity: 0,
        transition: { duration: DURATION.fast }
    }
};

// ============================================
// HOVER & TAP ANIMATIONS
// ============================================

// Card hover effect
export const cardHover = {
    rest: {
        scale: 1,
        y: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
    },
    hover: {
        scale: 1.02,
        y: -4,
        boxShadow: '0 12px 30px rgba(102, 126, 234, 0.2)',
        transition: SPRING.snappy
    },
    tap: {
        scale: 0.98,
        transition: { duration: DURATION.instant }
    }
};

// Button hover effect
export const buttonHover = {
    rest: { scale: 1 },
    hover: {
        scale: 1.02,
        transition: SPRING.snappy
    },
    tap: {
        scale: 0.97,
        transition: { duration: DURATION.instant }
    }
};

// Icon button hover
export const iconButtonHover = {
    rest: { scale: 1, rotate: 0 },
    hover: {
        scale: 1.1,
        transition: SPRING.snappy
    },
    tap: {
        scale: 0.9,
        transition: { duration: DURATION.instant }
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create stagger delay for index-based animations
 */
export const getStaggerDelay = (index, baseDelay = 0.05) => ({
    delay: index * baseDelay,
});

/**
 * Create viewport animation props for scroll reveals
 */
export const viewportReveal = {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, margin: '-50px' },
};

/**
 * Reduced motion check for accessibility
 */
export const prefersReducedMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation props respecting reduced motion preference
 */
export const getAccessibleAnimationProps = (props) => {
    if (prefersReducedMotion()) {
        return {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0 }
        };
    }
    return props;
};

// ============================================
// PAGE TRANSITION VARIANTS
// ============================================

export const pageTransitionVariants = {
    initial: {
        opacity: 0,
        y: 20
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: DURATION.medium,
            ease: EASING.decelerate,
            staggerChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: DURATION.fast,
            ease: EASING.accelerate
        }
    }
};

// ============================================
// SKELETON LOADING ANIMATION
// ============================================

export const skeletonAnimation = {
    initial: { backgroundPosition: '-200% 0' },
    animate: {
        backgroundPosition: '200% 0',
        transition: {
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear'
        }
    }
};

export default {
    DURATION,
    EASING,
    SPRING,
    fadeVariants,
    slideUpVariants,
    scaleVariants,
    modalVariants,
    staggerContainerVariants,
    staggerItemVariants,
    cardHover,
    buttonHover,
    pageTransitionVariants,
};
