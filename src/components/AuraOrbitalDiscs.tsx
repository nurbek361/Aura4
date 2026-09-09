import React from 'react';

interface AuraOrbitalDiscsProps {
  variant?: 'normal' | 'compact';
}

export const AuraOrbitalDiscs: React.FC<AuraOrbitalDiscsProps> = ({ variant = 'normal' }) => {
  const isCompact = variant === 'compact';

  const ring1Size = isCompact ? 'w-[180px] h-[180px]' : 'w-[245px] h-[245px] sm:w-[275px] sm:h-[275px]';
  const ring2Size = isCompact ? 'w-[195px] h-[195px]' : 'w-[260px] h-[260px] sm:w-[290px] sm:h-[290px]';
  const ring3Size = isCompact ? 'w-[170px] h-[170px]' : 'w-[235px] h-[235px] sm:w-[260px] sm:h-[260px]';

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* ========================================================
          DISC 1: Cyan / Aqua Neon Gyro Ring (Fast Clockwise)
          ======================================================== */}
      <div
        className="absolute flex items-center justify-center animate-orbit-tilt-1"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className={`${ring1Size} rounded-full animate-spin-clockwise-fast relative flex items-center justify-center`}
          style={{
            border: '2px solid rgba(6, 182, 212, 0.35)',
            borderTop: '3px solid rgba(34, 211, 238, 1)',
            borderRight: '2.5px solid rgba(6, 182, 212, 0.85)',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.7), inset 0 0 14px rgba(6, 182, 212, 0.35)',
          }}
        >
          {/* Inner concentric dashed track */}
          <div className="absolute inset-2 rounded-full border border-dashed border-cyan-400/40"></div>

          {/* Primary Orbiting Satellite Bead (Luminous cyan core) */}
          <div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-cyan-100 shadow-[0_0_12px_#22d3ee,0_0_24px_#06b6d4]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white mx-auto mt-1"></div>
          </div>

          {/* Micro Sparkle Node */}
          <div className="absolute bottom-2 right-4 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]"></div>
        </div>
      </div>

      {/* ========================================================
          DISC 2: Electric Violet Gyro Ring (Medium Counter-Clockwise)
          ======================================================== */}
      <div
        className="absolute flex items-center justify-center animate-orbit-tilt-2"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className={`${ring2Size} rounded-full animate-spin-counter-medium relative flex items-center justify-center`}
          style={{
            border: '2px solid rgba(139, 92, 246, 0.35)',
            borderBottom: '3px solid rgba(168, 85, 247, 1)',
            borderLeft: '2.5px solid rgba(139, 92, 246, 0.85)',
            boxShadow: '0 0 22px rgba(139, 92, 246, 0.65), inset 0 0 12px rgba(139, 92, 246, 0.35)',
          }}
        >
          {/* Inner concentric dashed track */}
          <div className="absolute inset-2.5 rounded-full border border-dashed border-purple-400/35"></div>

          {/* Primary Orbiting Satellite Bead (Electric violet core) */}
          <div
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-purple-100 shadow-[0_0_14px_#a855f7,0_0_26px_#8b5cf6]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white mx-auto mt-1"></div>
          </div>

          {/* Secondary Orbiting Bead */}
          <div className="absolute top-3 left-5 w-2 h-2 rounded-full bg-purple-300 shadow-[0_0_10px_#c084fc]"></div>
        </div>
      </div>

      {/* ========================================================
          DISC 3: Magenta / Pink Gyro Ring (Slow Clockwise)
          ======================================================== */}
      <div
        className="absolute flex items-center justify-center animate-orbit-tilt-3"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className={`${ring3Size} rounded-full animate-spin-clockwise-slow relative flex items-center justify-center`}
          style={{
            border: '1.5px solid rgba(236, 72, 153, 0.3)',
            borderTop: '2.5px solid rgba(244, 114, 182, 0.95)',
            borderLeft: '2px solid rgba(236, 72, 153, 0.75)',
            boxShadow: '0 0 18px rgba(236, 72, 153, 0.55), inset 0 0 10px rgba(236, 72, 153, 0.25)',
          }}
        >
          {/* Accent Orbiting Bead */}
          <div
            className="absolute top-1 right-3 w-3 h-3 rounded-full bg-pink-100 shadow-[0_0_12px_#ec4899,0_0_20px_#f43f5e]"
          >
            <div className="w-1 h-1 rounded-full bg-white mx-auto mt-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
