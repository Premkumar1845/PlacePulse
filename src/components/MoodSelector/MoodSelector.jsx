/**
 * MoodSelector Component
 * Interactive mood chips for place filtering - optimized
 */
import { useState } from 'react';
import './MoodSelector.css';

const MOODS = [
    { id: 'all', label: 'All', icon: '✨', color: '#6366f1' },
    { id: 'work', label: 'Work', icon: '💼', color: '#3b82f6' },
    { id: 'date', label: 'Date Night', icon: '💕', color: '#ec4899' },
    { id: 'quick-bite', label: 'Quick Bite', icon: '🍔', color: '#f97316' },
    { id: 'budget', label: 'Budget', icon: '💰', color: '#22c55e' },
    { id: 'chill', label: 'Chill', icon: '😌', color: '#8b5cf6' },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', color: '#06b6d4' },
    { id: 'drinks', label: 'Drinks', icon: '🍻', color: '#eab308' },
    { id: 'coffee', label: 'Coffee', icon: '☕', color: '#78716c' },
    { id: 'outdoors', label: 'Outdoors', icon: '🌲', color: '#22c55e' },
    { id: 'shopping', label: 'Shopping', icon: '🛒', color: '#f43f5e' },
    { id: 'fitness', label: 'Fitness', icon: '🏋️', color: '#ef4444' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎭', color: '#a855f7' },
];

const MoodChip = ({ mood, isSelected, onClick }) => {
    return (
        <button
            className={`mood-chip ${isSelected ? 'mood-chip--selected' : ''}`}
            style={{
                '--mood-color': mood.color,
                '--mood-color-light': `${mood.color}20`
            }}
            onClick={() => onClick(mood.id)}
        >
            <span className="mood-chip__icon">{mood.icon}</span>
            <span className="mood-chip__label">{mood.label}</span>
            {isSelected && <span className="mood-chip__check">✓</span>}
        </button>
    );
};

const MoodSelector = ({ selectedMood, onMoodChange, className = '' }) => {
    const [localMood, setLocalMood] = useState(selectedMood || 'all');

    const handleMoodSelect = (moodId) => {
        setLocalMood(moodId);
        if (onMoodChange) {
            onMoodChange(moodId);
        }
    };

    return (
        <div className={`mood-selector ${className}`}>
            <div className="mood-selector__header">
                <span className="mood-selector__title">How are you feeling today?</span>
                <span className="mood-selector__subtitle">Select a mood to filter places</span>
            </div>

            <div className="mood-selector__chips">
                {MOODS.map((mood) => (
                    <MoodChip
                        key={mood.id}
                        mood={mood}
                        isSelected={localMood === mood.id}
                        onClick={handleMoodSelect}
                    />
                ))}
            </div>

            {localMood !== 'all' && (
                <div className="mood-selector__active-label">
                    <span>Showing</span>
                    <span className="mood-selector__active-mood" style={{ color: MOODS.find(m => m.id === localMood)?.color }}>
                        {MOODS.find(m => m.id === localMood)?.icon} {MOODS.find(m => m.id === localMood)?.label}
                    </span>
                    <span>places</span>
                </div>
            )}
        </div>
    );
};

// Compact version for sidebar
export const MoodSelectorCompact = ({ selectedMood, onMoodChange }) => {
    const [localMood, setLocalMood] = useState(selectedMood || 'all');

    const handleMoodSelect = (moodId) => {
        setLocalMood(moodId);
        if (onMoodChange) {
            onMoodChange(moodId);
        }
    };

    return (
        <div className="mood-selector mood-selector--compact">
            <div className="mood-selector__chips mood-selector__chips--compact">
                {MOODS.slice(0, 5).map((mood) => (
                    <button
                        key={mood.id}
                        className={`mood-chip mood-chip--compact ${localMood === mood.id ? 'mood-chip--selected' : ''}`}
                        style={{ '--mood-color': mood.color }}
                        onClick={() => handleMoodSelect(mood.id)}
                    >
                        <span className="mood-chip__icon">{mood.icon}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MoodSelector;
export { MOODS };