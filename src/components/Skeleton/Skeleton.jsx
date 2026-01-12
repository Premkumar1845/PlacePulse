/**
 * Skeleton Loader Component
 * Provides loading placeholders with shimmer animation
 */

import React from 'react';
import { motion } from 'framer-motion';
import './Skeleton.css';

// Base skeleton shimmer animation
const shimmerVariants = {
    initial: { x: '-100%' },
    animate: {
        x: '100%',
        transition: {
            repeat: Infinity,
            duration: 1.2,
            ease: 'linear'
        }
    }
};

/**
 * Base Skeleton component
 */
export const Skeleton = ({
    width,
    height,
    borderRadius = '8px',
    className = '',
    style = {}
}) => (
    <div
        className={`skeleton ${className}`}
        style={{
            width,
            height,
            borderRadius,
            ...style
        }}
    >
        <motion.div
            className="skeleton-shimmer"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
        />
    </div>
);

/**
 * Skeleton for text lines
 */
export const SkeletonText = ({
    lines = 1,
    lineHeight = '1em',
    spacing = '0.5em',
    lastLineWidth = '70%'
}) => (
    <div className="skeleton-text-container">
        {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
                key={i}
                width={i === lines - 1 && lines > 1 ? lastLineWidth : '100%'}
                height={lineHeight}
                style={{ marginBottom: i < lines - 1 ? spacing : 0 }}
            />
        ))}
    </div>
);

/**
 * Skeleton for circular elements (avatars, icons)
 */
export const SkeletonCircle = ({ size = '40px' }) => (
    <Skeleton
        width={size}
        height={size}
        borderRadius="50%"
    />
);

/**
 * Skeleton for Place Card
 */
export const PlaceCardSkeleton = ({ index = 0 }) => (
    <motion.div
        className="place-card-skeleton"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
    >
        {/* Photo placeholder */}
        <Skeleton
            width="100%"
            height="160px"
            borderRadius="16px 16px 0 0"
        />

        {/* Content */}
        <div className="skeleton-content">
            {/* Badge placeholder */}
            <Skeleton width="60px" height="24px" borderRadius="12px" />

            {/* Title */}
            <Skeleton width="80%" height="20px" style={{ marginTop: '12px' }} />

            {/* Category */}
            <Skeleton width="100px" height="16px" style={{ marginTop: '8px' }} />

            {/* Rating */}
            <div className="skeleton-rating">
                <Skeleton width="80px" height="16px" />
                <Skeleton width="60px" height="14px" />
            </div>

            {/* Info row */}
            <div className="skeleton-info">
                <Skeleton width="70px" height="14px" />
                <Skeleton width="50px" height="14px" />
            </div>

            {/* Actions */}
            <div className="skeleton-actions">
                <Skeleton width="48%" height="36px" borderRadius="10px" />
                <Skeleton width="48%" height="36px" borderRadius="10px" />
            </div>
        </div>
    </motion.div>
);

/**
 * Multiple Place Card Skeletons
 */
export const PlaceCardsSkeletonList = ({ count = 6 }) => (
    <div className="skeleton-list">
        {Array.from({ length: count }).map((_, i) => (
            <PlaceCardSkeleton key={i} index={i} />
        ))}
    </div>
);

/**
 * Search Bar Skeleton
 */
export const SearchBarSkeleton = () => (
    <div className="search-bar-skeleton">
        <Skeleton width="100%" height="56px" borderRadius="16px" />
        <div className="skeleton-quick-moods">
            {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                    key={i}
                    width="90px"
                    height="38px"
                    borderRadius="25px"
                />
            ))}
        </div>
    </div>
);

/**
 * Map Skeleton
 */
export const MapSkeleton = () => (
    <div className="map-skeleton">
        <Skeleton width="100%" height="100%" borderRadius="0" />
        <div className="map-skeleton-icon">
            <motion.span
                animate={{
                    y: [0, -10, 0],
                    opacity: [0.5, 1, 0.5]
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: 'easeInOut'
                }}
            >
                🗺️
            </motion.span>
        </div>
    </div>
);

/**
 * Details Modal Skeleton
 */
export const DetailsSkeleton = () => (
    <div className="details-skeleton">
        {/* Hero */}
        <Skeleton width="100%" height="220px" borderRadius="24px 24px 0 0" />

        {/* Content */}
        <div className="skeleton-details-content">
            {/* Title */}
            <Skeleton width="70%" height="28px" />

            {/* Meta */}
            <div className="skeleton-meta">
                <Skeleton width="100px" height="28px" borderRadius="25px" />
                <Skeleton width="60px" height="28px" borderRadius="25px" />
            </div>

            {/* Rating */}
            <Skeleton width="100%" height="60px" borderRadius="16px" style={{ marginTop: '16px' }} />

            {/* Distance */}
            <div className="skeleton-distance">
                <Skeleton width="120px" height="40px" borderRadius="12px" />
                <Skeleton width="120px" height="40px" borderRadius="12px" />
            </div>

            {/* Info items */}
            <SkeletonText lines={4} lineHeight="20px" spacing="16px" />

            {/* Actions */}
            <div className="skeleton-detail-actions">
                <Skeleton width="100%" height="50px" borderRadius="14px" />
                <Skeleton width="100%" height="50px" borderRadius="14px" />
            </div>
        </div>
    </div>
);

export default {
    Skeleton,
    SkeletonText,
    SkeletonCircle,
    PlaceCardSkeleton,
    PlaceCardsSkeletonList,
    SearchBarSkeleton,
    MapSkeleton,
    DetailsSkeleton,
};
