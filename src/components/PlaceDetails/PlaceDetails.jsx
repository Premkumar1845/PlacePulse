/**
 * PlaceDetails Component
 * Detailed view modal/panel for a selected place
 * Enhanced with Framer Motion animations
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistance, getWalkingTime, getDrivingTime } from '../../utils/distance';
import { PRICE_LEVELS, CATEGORY_ICONS } from '../../utils/constants';
import { getPlaceTypeLabel, getPlacePhotoUrl, formatOpeningHours } from '../../services/placesApi';
import { SPRING, DURATION, EASING, modalVariants, buttonHover } from '../../utils/animations';
import './PlaceDetails.css';

// Animation variants
const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: DURATION.fast }
    },
    exit: {
        opacity: 0,
        transition: { duration: DURATION.fast, delay: 0.1 }
    }
};

const panelVariants = {
    hidden: {
        opacity: 0,
        y: 50,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            ...SPRING.gentle,
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        y: 30,
        scale: 0.95,
        transition: { duration: DURATION.fast }
    }
};

const heroVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: DURATION.slow, ease: EASING.decelerate }
    }
};

const contentItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: SPRING.gentle
    }
};

const closeButtonVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: {
        scale: 1.1,
        rotate: 90,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        transition: SPRING.snappy
    },
    tap: { scale: 0.9 }
};

const statusBadgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            delay: 0.3,
            ...SPRING.snappy
        }
    }
};

const distanceItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.1,
            ...SPRING.gentle
        }
    }),
    hover: {
        scale: 1.05,
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        transition: SPRING.snappy
    }
};

const starVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
        scale: 1,
        opacity: 1,
        transition: {
            delay: 0.2 + i * 0.05,
            ...SPRING.snappy
        }
    }),
    hover: {
        scale: 1.3,
        y: -3,
        transition: SPRING.snappy
    }
};

const PlaceDetails = ({ place, details, onClose, isOpen }) => {
    if (!place) return null;

    // Merge place and details data
    const data = { ...place, ...details };

    // Get photos
    const photos = data.photos || [];
    const mainPhoto = photos.length > 0 ? getPlacePhotoUrl(data, 600) : null;

    // Get opening hours
    const openingHours = formatOpeningHours(data.opening_hours);

    // Get category icon
    const getCategoryIcon = () => {
        const types = data.types || [];
        for (const type of types) {
            if (CATEGORY_ICONS[type]) {
                return CATEGORY_ICONS[type];
            }
        }
        return CATEGORY_ICONS.default;
    };

    // Open in Google Maps
    const openInMaps = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.name)}&query_place_id=${data.place_id}`;
        window.open(url, '_blank');
    };

    // Open directions
    const openDirections = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(data.name)}&destination_place_id=${data.place_id}`;
        window.open(url, '_blank');
    };

    return (
        <AnimatePresence>
            {isOpen !== false && (
                <motion.div
                    className="place-details-overlay"
                    onClick={onClose}
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <motion.div
                        className="place-details-panel"
                        onClick={(e) => e.stopPropagation()}
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Close Button */}
                        <motion.button
                            className="close-btn"
                            onClick={onClose}
                            aria-label="Close"
                            variants={closeButtonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            ✕
                        </motion.button>

                        {/* Hero Photo */}
                        <motion.div
                            className="details-hero"
                            variants={heroVariants}
                        >
                            {mainPhoto ? (
                                <motion.img
                                    src={mainPhoto}
                                    alt={data.name}
                                    initial={{ scale: 1.1 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.6 }}
                                    whileHover={{ scale: 1.05 }}
                                />
                            ) : (
                                <motion.div
                                    className="hero-placeholder"
                                    animate={{
                                        backgroundPosition: ['0% 0%', '100% 100%']
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        repeatType: 'reverse'
                                    }}
                                >
                                    <motion.span
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 5, -5, 0]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity
                                        }}
                                    >
                                        {getCategoryIcon()}
                                    </motion.span>
                                </motion.div>
                            )}

                            {/* Status Badge */}
                            {openingHours.isOpen !== null && (
                                <motion.div
                                    className={`status-badge ${openingHours.isOpen ? 'open' : 'closed'}`}
                                    variants={statusBadgeVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {openingHours.status}
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Content */}
                        <div className="details-content">
                            {/* Header */}
                            <motion.div
                                className="details-header"
                                variants={contentItemVariants}
                            >
                                <motion.h2
                                    className="details-name"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.15, ...SPRING.gentle }}
                                >
                                    {data.name}
                                </motion.h2>
                                <motion.div
                                    className="details-meta"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <motion.span
                                        className="details-category"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <motion.span
                                            className="category-icon"
                                            whileHover={{ rotate: 10, scale: 1.2 }}
                                        >
                                            {getCategoryIcon()}
                                        </motion.span>
                                        {getPlaceTypeLabel(data.types)}
                                    </motion.span>
                                    {data.price_level !== undefined && (
                                        <motion.span
                                            className="details-price"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.25 }}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {PRICE_LEVELS[data.price_level]}
                                        </motion.span>
                                    )}
                                </motion.div>
                            </motion.div>

                            {/* Rating Section */}
                            {data.rating && (
                                <motion.div
                                    className="details-rating"
                                    variants={contentItemVariants}
                                >
                                    <div className="rating-display">
                                        <motion.span
                                            className="rating-value"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2, ...SPRING.snappy }}
                                        >
                                            {data.rating.toFixed(1)}
                                        </motion.span>
                                        <div className="rating-stars">
                                            {[1, 2, 3, 4, 5].map((star, i) => (
                                                <motion.span
                                                    key={star}
                                                    className={`star ${star <= Math.round(data.rating) ? 'filled' : ''}`}
                                                    variants={starVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    whileHover="hover"
                                                    custom={i}
                                                >
                                                    ★
                                                </motion.span>
                                            ))}
                                        </div>
                                    </div>
                                    {data.user_ratings_total && (
                                        <motion.span
                                            className="rating-count"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            Based on {data.user_ratings_total.toLocaleString()} reviews
                                        </motion.span>
                                    )}
                                </motion.div>
                            )}

                            {/* Distance Info */}
                            {data.distance && (
                                <motion.div
                                    className="details-distance"
                                    variants={contentItemVariants}
                                >
                                    {[
                                        { icon: '📍', value: formatDistance(data.distance) },
                                        { icon: '🚶', value: getWalkingTime(data.distance) },
                                        { icon: '🚗', value: getDrivingTime(data.distance) }
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            className="distance-item"
                                            variants={distanceItemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            whileHover="hover"
                                            custom={i}
                                        >
                                            <motion.span
                                                className="distance-icon"
                                                whileHover={{ scale: 1.2 }}
                                            >
                                                {item.icon}
                                            </motion.span>
                                            <span className="distance-value">{item.value}</span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {/* Contact & Address */}
                            <motion.div
                                className="details-info"
                                variants={contentItemVariants}
                            >
                                {(data.formatted_address || data.vicinity) && (
                                    <motion.div
                                        className="info-item"
                                        whileHover={{ x: 4 }}
                                        transition={SPRING.snappy}
                                    >
                                        <span className="info-icon">📍</span>
                                        <span className="info-text">{data.formatted_address || data.vicinity}</span>
                                    </motion.div>
                                )}
                                {data.formatted_phone_number && (
                                    <motion.div
                                        className="info-item"
                                        whileHover={{ x: 4 }}
                                        transition={SPRING.snappy}
                                    >
                                        <span className="info-icon">📞</span>
                                        <motion.a
                                            href={`tel:${data.formatted_phone_number}`}
                                            className="info-link"
                                            whileHover={{ color: '#6366f1' }}
                                        >
                                            {data.formatted_phone_number}
                                        </motion.a>
                                    </motion.div>
                                )}
                                {data.website && (
                                    <motion.div
                                        className="info-item"
                                        whileHover={{ x: 4 }}
                                        transition={SPRING.snappy}
                                    >
                                        <span className="info-icon">🌐</span>
                                        <motion.a
                                            href={data.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="info-link"
                                            whileHover={{ color: '#6366f1' }}
                                        >
                                            Visit website
                                        </motion.a>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Opening Hours */}
                            {openingHours.periods.length > 0 && (
                                <motion.div
                                    className="details-hours"
                                    variants={contentItemVariants}
                                >
                                    <h3 className="section-title">Hours</h3>
                                    <motion.ul
                                        className="hours-list"
                                        initial="hidden"
                                        animate="visible"
                                        variants={{
                                            hidden: {},
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.03
                                                }
                                            }
                                        }}
                                    >
                                        {openingHours.periods.map((period, index) => (
                                            <motion.li
                                                key={index}
                                                className="hours-item"
                                                variants={{
                                                    hidden: { opacity: 0, x: -10 },
                                                    visible: { opacity: 1, x: 0 }
                                                }}
                                                whileHover={{
                                                    x: 4,
                                                    backgroundColor: 'rgba(99, 102, 241, 0.05)'
                                                }}
                                            >
                                                {period}
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                </motion.div>
                            )}

                            {/* Action Buttons */}
                            <motion.div
                                className="details-actions"
                                variants={contentItemVariants}
                            >
                                <motion.button
                                    className="action-btn primary"
                                    onClick={openDirections}
                                    variants={buttonHover}
                                    initial="rest"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <motion.span
                                        className="btn-icon"
                                        whileHover={{ rotate: 15 }}
                                    >
                                        🧭
                                    </motion.span>
                                    Get Directions
                                </motion.button>
                                <motion.button
                                    className="action-btn secondary"
                                    onClick={openInMaps}
                                    variants={buttonHover}
                                    initial="rest"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <motion.span
                                        className="btn-icon"
                                        whileHover={{ scale: 1.2 }}
                                    >
                                        🗺️
                                    </motion.span>
                                    Open in Maps
                                </motion.button>
                                {data.website && (
                                    <motion.a
                                        href={data.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="action-btn secondary"
                                        variants={buttonHover}
                                        initial="rest"
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <motion.span
                                            className="btn-icon"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            🌐
                                        </motion.span>
                                        Website
                                    </motion.a>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PlaceDetails;
