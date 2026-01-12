/**
 * Header Component
 * Application header with branding, location info, and theme toggle
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlacePulseLogo from '../Logo/Logo';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { SPRING, EASING, DURATION, buttonHover } from '../../utils/animations';
import './Header.css';

// Animation variants
const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: DURATION.medium,
            ease: EASING.decelerate,
            staggerChildren: 0.1
        }
    }
};

const brandVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: SPRING.gentle
    }
};

const locationVariants = {
    hidden: { x: 20, opacity: 0, scale: 0.95 },
    visible: {
        x: 0,
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

const logoIconVariants = {
    initial: { rotate: 0 },
    animate: {
        rotate: [0, -10, 10, -5, 5, 0],
        transition: {
            duration: 0.6,
            ease: 'easeInOut',
            delay: 0.5
        }
    },
    hover: {
        scale: 1.15,
        rotate: 15,
        transition: SPRING.snappy
    }
};

const Header = ({ location, address, locationError, onRefreshLocation }) => {
    // Format display text based on available data
    const getLocationDisplay = () => {
        if (address) {
            // Show medium format (area, city) or short format
            return address.medium || address.short || address.formatted;
        }
        // Fallback to coordinates if address not available yet
        if (location) {
            return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
        }
        return 'Getting location...';
    };

    return (
        <motion.header
            className="header"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="header-content">
                {/* Logo and Brand - Using animated PlacePulse logo */}
                <motion.div
                    className="header-brand"
                    variants={brandVariants}
                >
                    <PlacePulseLogo
                        size="md"
                        showText={true}
                        animate={true}
                        variant="default"
                    />
                </motion.div>

                {/* Location Info with AnimatePresence for smooth transitions */}
                <div className="header-location">
                    <AnimatePresence mode="wait">
                        {locationError ? (
                            <motion.div
                                key="error"
                                className="location-error"
                                variants={locationVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <motion.span
                                    className="location-icon"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 10, -10, 0]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        repeatDelay: 2,
                                        duration: 0.5
                                    }}
                                >
                                    ⚠️
                                </motion.span>
                                <span className="location-text">Location unavailable</span>
                                <motion.button
                                    className="location-retry-btn"
                                    onClick={onRefreshLocation}
                                    title="Retry getting location"
                                    variants={buttonHover}
                                    initial="rest"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    Retry
                                </motion.button>
                            </motion.div>
                        ) : location ? (
                            <motion.div
                                key="info"
                                className="location-info"
                                variants={locationVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <motion.span
                                    className="location-icon"
                                    animate={{
                                        y: [0, -2, 0],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2,
                                        ease: 'easeInOut'
                                    }}
                                >
                                    📍
                                </motion.span>
                                <span className="location-text" title={address?.formatted || `${location.lat}, ${location.lng}`}>
                                    {getLocationDisplay()}
                                </span>
                                <motion.button
                                    className="location-refresh-btn"
                                    onClick={onRefreshLocation}
                                    title="Refresh location"
                                    variants={buttonHover}
                                    initial="rest"
                                    whileHover="hover"
                                    whileTap="tap"
                                    whileHoverTransition={SPRING.snappy}
                                >
                                    <motion.svg
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        whileHover={{ rotate: 180 }}
                                        transition={SPRING.gentle}
                                    >
                                        <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                                    </motion.svg>
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="loading"
                                className="location-loading"
                                variants={locationVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <motion.span
                                    className="location-icon"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1,
                                        ease: 'linear'
                                    }}
                                >
                                    🔄
                                </motion.span>
                                <span className="location-text">Getting location...</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Theme Toggle */}
                <div className="header-actions">
                    <ThemeToggle />
                </div>
            </div>
        </motion.header>
    );
};

export default Header;
