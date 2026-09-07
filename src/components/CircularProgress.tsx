import React from 'react';

interface CircularProgressProps {
  /** 0 - 100 */
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  /** Content rendered in the center of the ring (number, icon, play button…) */
  children?: React.ReactNode;
  /** Extra class names on the wrapping div */
  className?: string;
  /** Glow the ring in its own color */
  glow?: boolean;
}

/**
 * A dynamic, animated SVG circular progress ring. Re-renders the stroke
 * offset whenever `percent` changes, with a smooth CSS transition — used
 * across Aura for reading progress, audio playback position, daily health
 * goals, and habit trackers.
 */
export const CircularProgress: React.FC<CircularProgressProps> = ({
  percent,
  size = 64,
  strokeWidth = 6,
  color = '#a078ff',
  trackColor = 'rgba(255,255,255,0.08)',
  children,
  className = '',
  glow = true,
}) => {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        style={glow ? ({ filter: `drop-shadow(0 0 6px ${color}66)` } as React.CSSProperties) : undefined}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
};
