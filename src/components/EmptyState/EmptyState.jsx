/**
 * EmptyState Component
 * Clean empty state illustrations with animations
 */
import { motion } from 'framer-motion';
import './EmptyState.css';

const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0, 0, 0.2, 1] }
    }
};

const iconVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: { delay: 0.2, duration: 0.4, type: 'spring', stiffness: 200 }
    }
};

const EmptyState = ({
    icon = '🔍',
    title = 'No results found',
    description = 'Try adjusting your search or filters',
    action = null,
    variant = 'default' // 'default' | 'search' | 'error' | 'location'
}) => {
    const getIllustration = () => {
        switch (variant) {
            case 'search':
                return (
                    <svg className="empty-state__illustration" viewBox="0 0 200 160" fill="none">
                        <circle cx="100" cy="70" r="50" fill="var(--pp-neutral-100)" />
                        <circle cx="100" cy="70" r="35" fill="var(--pp-neutral-50)" stroke="var(--pp-neutral-200)" strokeWidth="2" />
                        <line x1="125" y1="95" x2="150" y2="120" stroke="var(--pp-neutral-300)" strokeWidth="8" strokeLinecap="round" />
                        <motion.circle
                            cx="100" cy="70" r="20"
                            fill="none"
                            stroke="var(--pp-primary-200)"
                            strokeWidth="2"
                            strokeDasharray="6 4"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        />
                    </svg>
                );
            case 'location':
                return (
                    <svg className="empty-state__illustration" viewBox="0 0 200 160" fill="none">
                        <circle cx="100" cy="80" r="60" fill="var(--pp-neutral-100)" />
                        <motion.path
                            d="M100 30C82 30 68 44 68 60C68 85 100 115 100 115S132 85 132 60C132 44 118 30 100 30ZM100 72C93 72 88 67 88 60S93 48 100 48S112 53 112 60S107 72 100 72Z"
                            fill="var(--pp-primary-400)"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.circle
                            cx="100" cy="130" r="30"
                            fill="var(--pp-primary-100)"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.3, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="empty-state__illustration" viewBox="0 0 200 160" fill="none">
                        <circle cx="100" cy="80" r="55" fill="var(--pp-error-50)" />
                        <motion.circle
                            cx="100" cy="80" r="40"
                            fill="var(--pp-error-100)"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <text x="100" y="95" textAnchor="middle" fontSize="40" fill="var(--pp-error-500)">!</text>
                    </svg>
                );
            default:
                return (
                    <div className="empty-state__icon-wrapper">
                        <motion.span
                            className="empty-state__icon"
                            variants={iconVariants}
                            initial="initial"
                            animate="animate"
                        >
                            {icon}
                        </motion.span>
                    </div>
                );
        }
    };

    return (
        <motion.div
            className={`empty-state empty-state--${variant}`}
            variants={containerVariants}
            initial="initial"
            animate="animate"
        >
            {getIllustration()}

            <div className="empty-state__content">
                <h3 className="empty-state__title">{title}</h3>
                <p className="empty-state__description">{description}</p>
            </div>

            {action && (
                <motion.div
                    className="empty-state__action"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {action}
                </motion.div>
            )}
        </motion.div>
    );
};

// Preset empty states
export const SearchEmptyState = ({ onReset }) => (
    <EmptyState
        variant="search"
        title="No places found"
        description="We couldn't find any places matching your search. Try different keywords or broaden your filters."
        action={
            onReset && (
                <button className="empty-state__btn" onClick={onReset}>
                    Clear Search
                </button>
            )
        }
    />
);

export const LocationEmptyState = ({ onRetry }) => (
    <EmptyState
        variant="location"
        title="Enable Location"
        description="Allow location access to discover amazing places around you."
        action={
            onRetry && (
                <button className="empty-state__btn" onClick={onRetry}>
                    Enable Location
                </button>
            )
        }
    />
);

export const ErrorEmptyState = ({ message, onRetry }) => (
    <EmptyState
        variant="error"
        title="Something went wrong"
        description={message || "We encountered an error. Please try again."}
        action={
            onRetry && (
                <button className="empty-state__btn" onClick={onRetry}>
                    Try Again
                </button>
            )
        }
    />
);

export default EmptyState;
