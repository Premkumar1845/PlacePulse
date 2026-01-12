/**
 * PlacePulse Animated Logo
 * A location-aware brand mark with pulse animation
 * 
 * Features:
 * - SVG-based scalable design
 * - Framer Motion animations
 * - Pulsing radar rings
 * - Orbiting signal dot
 * - Multiple size variants
 * - Light/dark theme support
 */

import React from 'react';
import { motion } from 'framer-motion';
import './Logo.css';

// Animation variants for the pulse rings
const ringVariants = {
    initial: {
        scale: 0.8,
        opacity: 0
    },
    animate: (delay) => ({
        scale: [0.8, 1.8, 2.2],
        opacity: [0.6, 0.3, 0],
        transition: {
            duration: 2,
            delay: delay,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1]
        }
    })
};

// Animation for the center pin
const pinVariants = {
    initial: { scale: 1 },
    animate: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    },
    hover: {
        scale: 1.1,
        transition: { type: 'spring', stiffness: 400, damping: 10 }
    }
};

// Orbiting dot animation
const orbitVariants = {
    animate: {
        rotate: 360,
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'linear'
        }
    }
};

// Signal dot pulse
const signalDotVariants = {
    animate: {
        scale: [1, 1.3, 1],
        opacity: [1, 0.8, 1],
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

// Logo sizes
const SIZES = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    '2xl': 80
};

const PlacePulseLogo = ({
    size = 'md',
    animate = true,
    showText = false,
    className = '',
    variant = 'default' // 'default', 'minimal', 'glow'
}) => {
    const dimension = typeof size === 'number' ? size : SIZES[size] || SIZES.md;
    const isLarge = dimension >= 48;

    return (
        <div className={`pp-logo ${className} pp-logo--${variant}`}>
            <motion.div
                className="pp-logo__mark"
                style={{ width: dimension, height: dimension }}
                whileHover={animate ? 'hover' : undefined}
                initial="initial"
                animate={animate ? 'animate' : undefined}
            >
                <svg
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="pp-logo__svg"
                >
                    {/* Definitions for gradients and filters */}
                    <defs>
                        {/* Primary gradient */}
                        <linearGradient id="ppGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#d946ef" />
                        </linearGradient>

                        {/* Glow filter */}
                        <filter id="ppGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Drop shadow */}
                        <filter id="ppShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
                        </filter>
                    </defs>

                    {/* Pulse rings */}
                    {animate && (
                        <g className="pp-logo__rings">
                            {[0, 0.5, 1].map((delay, i) => (
                                <motion.circle
                                    key={i}
                                    cx="32"
                                    cy="32"
                                    r="12"
                                    fill="none"
                                    stroke="url(#ppGradient)"
                                    strokeWidth="1.5"
                                    strokeOpacity="0.6"
                                    variants={ringVariants}
                                    custom={delay}
                                    initial="initial"
                                    animate="animate"
                                />
                            ))}
                        </g>
                    )}

                    {/* Location pin */}
                    <motion.g
                        variants={pinVariants}
                        filter={variant === 'glow' ? 'url(#ppGlow)' : 'url(#ppShadow)'}
                        style={{ originX: '32px', originY: '32px' }}
                    >
                        {/* Pin body */}
                        <path
                            d="M32 8C22.059 8 14 16.059 14 26c0 12 18 30 18 30s18-18 18-30c0-9.941-8.059-18-18-18z"
                            fill="url(#ppGradient)"
                            className="pp-logo__pin"
                        />

                        {/* Inner circle */}
                        <circle
                            cx="32"
                            cy="26"
                            r="7"
                            fill="white"
                            className="pp-logo__pin-center"
                        />

                        {/* Center dot */}
                        <motion.circle
                            cx="32"
                            cy="26"
                            r="3"
                            fill="url(#ppGradient)"
                            variants={animate ? signalDotVariants : undefined}
                        />
                    </motion.g>

                    {/* Orbiting signal dot */}
                    {animate && isLarge && (
                        <motion.g
                            variants={orbitVariants}
                            animate="animate"
                            style={{ originX: '32px', originY: '32px' }}
                        >
                            <motion.circle
                                cx="52"
                                cy="32"
                                r="3"
                                fill="#3b82f6"
                                variants={signalDotVariants}
                                animate="animate"
                            />
                        </motion.g>
                    )}
                </svg>
            </motion.div>

            {/* Logo text */}
            {showText && (
                <motion.div
                    className="pp-logo__text"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                >
                    <span className="pp-logo__name">PlacePulse</span>
                    {isLarge && (
                        <span className="pp-logo__tagline">Real-Time Place Intelligence</span>
                    )}
                </motion.div>
            )}
        </div>
    );
};

// Minimal icon variant for favicons and small uses
export const PlacePulseIcon = ({ size = 32, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="ppIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
        </defs>
        <path
            d="M16 2C10.477 2 6 6.477 6 12c0 8 10 18 10 18s10-10 10-18c0-5.523-4.477-10-10-10z"
            fill="url(#ppIconGradient)"
        />
        <circle cx="16" cy="12" r="4" fill="white" />
        <circle cx="16" cy="12" r="1.5" fill="url(#ppIconGradient)" />
    </svg>
);

// Loading variant with continuous animation
export const PlacePulseLoader = ({ size = 'lg' }) => {
    const dimension = typeof size === 'number' ? size : SIZES[size] || SIZES.lg;

    return (
        <div className="pp-logo pp-logo--loader">
            <motion.div
                className="pp-logo__mark"
                style={{ width: dimension, height: dimension }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
                <svg viewBox="0 0 64 64" fill="none">
                    <defs>
                        <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>

                    {/* Rotating radar sweep */}
                    <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="url(#loaderGradient)"
                        strokeWidth="2"
                        strokeDasharray="40 140"
                        strokeLinecap="round"
                    />

                    {/* Center pin */}
                    <path
                        d="M32 14C25.373 14 20 19.373 20 26c0 8 12 20 12 20s12-12 12-20c0-6.627-5.373-12-12-12z"
                        fill="url(#loaderGradient)"
                    />
                    <circle cx="32" cy="26" r="4" fill="white" />
                </svg>
            </motion.div>
        </div>
    );
};

export default PlacePulseLogo;
